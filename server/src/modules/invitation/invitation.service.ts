import prisma from '../../lib/prisma.js';
import { invitationRepository } from './invitation.repository.js';
import { InvitationStatus, ParticipantRole, ParticipantStatus } from '../../generated/prisma/client.js';
import { NotFoundError, ForbiddenError, BadRequestError, ConflictError } from '../../errors/customErrors.js';
import type { SendInvitationInput, InvitationDTO, ListInvitationQuery } from './invitation.types.js';

export class InvitationService {
  /**
   * Private helper mapper to convert database models to clean InvitationDTO objects.
   */
  private toInvitationDTO(invitation: any): InvitationDTO {
    return {
      id: invitation.id,
      status: invitation.status,
      message: invitation.message,
      expiresAt: invitation.expiresAt,
      respondedAt: invitation.respondedAt,
      createdAt: invitation.createdAt,
      activity: {
        id: invitation.activity.id,
        title: invitation.activity.title,
        startsAt: invitation.activity.startsAt,
      },
      invitedBy: {
        id: invitation.invitedBy.id,
        name: invitation.invitedBy.name,
        profileImageUrl: invitation.invitedBy.profileImageUrl,
      },
      invitedUser: invitation.invitedUser ? {
        id: invitation.invitedUser.id,
        name: invitation.invitedUser.name,
        profileImageUrl: invitation.invitedUser.profileImageUrl,
      } : undefined,
    };
  }

  /**
   * Sends an invitation to a user for an activity.
   */
  public async sendInvitation(
    organizerId: string,
    activityId: string,
    input: SendInvitationInput
  ): Promise<InvitationDTO> {
    // 1. Fetch and validate activity
    const activity = await invitationRepository.findActivityById(activityId);
    if (!activity || activity.deletedAt !== null) {
      throw new NotFoundError('Activity not found');
    }

    // 2. Validate organizer permissions
    if (activity.organizerId !== organizerId) {
      throw new ForbiddenError('Only the activity organizer can send invitations');
    }

    // 3. Validate activity states
    if (activity.status === 'CANCELLED') {
      throw new BadRequestError('Cannot send invitation for a cancelled activity');
    }
    if (activity.status === 'COMPLETED') {
      throw new BadRequestError('Cannot send invitation for a completed activity');
    }
    if (activity.status !== 'OPEN') {
      throw new BadRequestError('Cannot send invitation for an activity that is not open');
    }

    // 4. Validate startsAt/endsAt time
    if (new Date(activity.startsAt) <= new Date()) {
      throw new BadRequestError('Cannot send invitation for an activity that has already started');
    }

    // 5. Validate target user is not already an accepted participant
    const existingParticipant = await invitationRepository.findParticipantByActivityAndUser(
      activityId,
      input.invitedUserId
    );
    if (existingParticipant && existingParticipant.status === ParticipantStatus.ACCEPTED) {
      throw new ConflictError('User is already a participant in this activity');
    }

    // 6. Validate capacity limits
    if (activity.participants.length >= activity.maxParticipants) {
      throw new ConflictError('Activity is full');
    }

    // 7. Fetch and validate invited user
    const invitedUser = await invitationRepository.findUserById(input.invitedUserId);
    if (!invitedUser || invitedUser.deletedAt !== null) {
      throw new NotFoundError('User not found');
    }

    // 8. Validate self invitation rules
    if (input.invitedUserId === organizerId) {
      throw new BadRequestError('You cannot invite yourself');
    }

    // 9. Validate organizer invitation rules
    if (activity.organizerId === input.invitedUserId) {
      throw new BadRequestError('You cannot invite the organizer of the activity');
    }

    // 10. Check if an invitation record already exists for this pair due to DB unique constraints
    const existingInvitation = await invitationRepository.findInvitationByActivityAndUser(
      activityId,
      input.invitedUserId
    );

    if (existingInvitation) {
      if (existingInvitation.status === InvitationStatus.PENDING) {
        throw new ConflictError('A pending invitation already exists for this user');
      }
      
      // If the invitation was declined, cancelled or expired, we reuse and update the row
      const updated = await invitationRepository.updateInvitation(existingInvitation.id, {
        status: InvitationStatus.PENDING,
        message: input.message || null,
        expiresAt: input.expiresAt || null,
        respondedAt: null,
        invitedById: organizerId,
      });
      return this.toInvitationDTO(updated);
    }

    // 11. Create new invitation record and return mapped DTO
    const invitation = await invitationRepository.create(
      activityId,
      input.invitedUserId,
      organizerId,
      input.message,
      input.expiresAt
    );

    return this.toInvitationDTO(invitation);
  }

  /**
   * Accepts a pending invitation. Adds the user to participants in a transaction.
   */
  public async acceptInvitation(invitedUserId: string, invitationId: string): Promise<InvitationDTO> {
    // 1. Fetch invitation
    const invitation = await invitationRepository.findInvitationById(invitationId);
    if (!invitation) {
      throw new NotFoundError('Invitation not found');
    }

    // 2. Validate ownership of invitation
    if (invitation.invitedUserId !== invitedUserId) {
      throw new ForbiddenError('This invitation is not for you');
    }

    // 3. Handle already responded states
    if (invitation.status === InvitationStatus.ACCEPTED) {
      throw new ConflictError('Invitation has already been accepted');
    }
    if (invitation.status === InvitationStatus.DECLINED) {
      throw new ConflictError('Invitation has already been declined');
    }
    if (invitation.status === InvitationStatus.CANCELLED) {
      throw new ConflictError('Invitation has been cancelled');
    }
    if (invitation.status === InvitationStatus.EXPIRED) {
      throw new BadRequestError('Invitation has expired');
    }

    const now = new Date();

    // 4. Validate temporal expiry
    if (invitation.expiresAt && new Date(invitation.expiresAt) < now) {
      await invitationRepository.updateStatus(invitationId, InvitationStatus.EXPIRED, now);
      throw new BadRequestError('Invitation has expired');
    }

    // 5. Validate activity constraints
    if (!invitation.activity || invitation.activity.deletedAt !== null) {
      throw new NotFoundError('Activity not found');
    }
    if (invitation.activity.status === 'CANCELLED') {
      throw new BadRequestError('Cannot accept invitation for a cancelled activity');
    }
    if (invitation.activity.status === 'COMPLETED') {
      throw new BadRequestError('Cannot accept invitation for a completed activity');
    }
    if (invitation.activity.status !== 'OPEN') {
      throw new BadRequestError('Cannot accept invitation for an activity that is not open');
    }
    if (new Date(invitation.activity.startsAt) <= now) {
      throw new BadRequestError('Cannot accept invitation for an activity that has already started');
    }

    // 6. Execute ACID transaction boundary
    return prisma.$transaction(async (tx) => {
      // Re-fetch activity within transaction context to lock/check capacity limits
      const activity = await invitationRepository.findActivityById(invitation.activityId, tx);
      if (!activity) {
        throw new NotFoundError('Activity not found');
      }

      if (activity.participants.length >= activity.maxParticipants) {
        throw new ConflictError('Activity is full');
      }

      // Check if participant row exists
      const existingPart = await invitationRepository.findParticipantByActivityAndUser(
        invitation.activityId,
        invitation.invitedUserId,
        tx
      );

      if (existingPart) {
        if (existingPart.status === ParticipantStatus.ACCEPTED) {
          throw new ConflictError('You are already a participant in this activity');
        }
        // Update status to accepted (e.g. if they previously LEFT)
        await invitationRepository.updateParticipant(existingPart.id, ParticipantStatus.ACCEPTED, tx);
      } else {
        // Create new participant row
        await invitationRepository.createParticipant(
          invitation.activityId,
          invitation.invitedUserId,
          ParticipantRole.PARTICIPANT,
          ParticipantStatus.ACCEPTED,
          tx
        );
      }

      // Update invitation state to accepted
      const updated = await invitationRepository.updateStatus(invitationId, InvitationStatus.ACCEPTED, now, tx);
      return this.toInvitationDTO(updated);
    });
  }

  /**
   * Rejects a pending invitation.
   */
  public async rejectInvitation(invitedUserId: string, invitationId: string): Promise<InvitationDTO> {
    const invitation = await invitationRepository.findInvitationById(invitationId);
    if (!invitation) {
      throw new NotFoundError('Invitation not found');
    }

    if (invitation.invitedUserId !== invitedUserId) {
      throw new ForbiddenError('This invitation is not for you');
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new BadRequestError('Only pending invitations can be rejected');
    }

    const now = new Date();

    // Validate temporal expiry
    if (invitation.expiresAt && new Date(invitation.expiresAt) < now) {
      await invitationRepository.updateStatus(invitationId, InvitationStatus.EXPIRED, now);
      throw new BadRequestError('Invitation has expired');
    }

    const updated = await invitationRepository.updateStatus(invitationId, InvitationStatus.DECLINED, now);
    return this.toInvitationDTO(updated);
  }

  /**
   * Cancels a pending invitation (Organizer only).
   */
  public async cancelInvitation(organizerId: string, invitationId: string): Promise<InvitationDTO> {
    const invitation = await invitationRepository.findInvitationById(invitationId);
    if (!invitation) {
      throw new NotFoundError('Invitation not found');
    }

    if (invitation.invitedById !== organizerId) {
      throw new ForbiddenError('Only the activity organizer can cancel this invitation');
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new BadRequestError('Only pending invitations can be cancelled');
    }

    const now = new Date();

    // Validate temporal expiry
    if (invitation.expiresAt && new Date(invitation.expiresAt) < now) {
      await invitationRepository.updateStatus(invitationId, InvitationStatus.EXPIRED, now);
      throw new BadRequestError('Invitation has expired');
    }

    const updated = await invitationRepository.cancel(invitationId, now);
    return this.toInvitationDTO(updated);
  }

  /**
   * Lists received invitations for the current user.
   */
  public async listReceived(invitedUserId: string, queryOptions: ListInvitationQuery): Promise<InvitationDTO[]> {
    const invitations = await invitationRepository.findByInvitedUser(invitedUserId, queryOptions);
    return invitations.map((inv: any) => this.toInvitationDTO(inv));
  }

  /**
   * Lists sent invitations for a specific activity (Organizer only).
   */
  public async listSent(organizerId: string, activityId: string): Promise<InvitationDTO[]> {
    const activity = await invitationRepository.findActivityById(activityId);
    if (!activity || activity.deletedAt !== null) {
      throw new NotFoundError('Activity not found');
    }

    if (activity.organizerId !== organizerId) {
      throw new ForbiddenError('Only the organizer can view invitations sent for this activity');
    }

    const invitations = await invitationRepository.findByActivity(activityId);
    return invitations.map((inv: any) => this.toInvitationDTO(inv));
  }
}

export const invitationService = new InvitationService();
export default invitationService;
