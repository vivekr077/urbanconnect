import prisma from '../../lib/prisma.js';
import { invitationRepository } from './invitation.repository.js';
import { activityPermissionService } from '../activity/activityPermission.service.js';
import { participantRepository } from '../participant/participant.repository.js';
import { userRepository } from '../user/index.js';
import { NotFoundError, ForbiddenError, BadRequestError, ConflictError } from '../../errors/customErrors.js';
import { InvitationStatus } from '../../generated/prisma/client.js';
import type { SendInvitationInput, InvitationDTO } from './invitation.types.js';

export class InvitationService {
  /**
   * Sends an invitation to a user.
   */
  public async sendInvitation(
    invitedById: string,
    activityId: string,
    input: SendInvitationInput
  ): Promise<InvitationDTO> {
    const { invitedUserId, message, expiresAt } = input;

    // 1. Validate activity exists
    const activity = await activityPermissionService.getAndValidateActiveActivity(activityId);

    // 2. Validate organizer permissions
    activityPermissionService.validateIsOrganizer(activity, invitedById);

    // 3. Activity status check (cannot invite if CANCELLED or COMPLETED)
    if (activity.status === 'CANCELLED' || activity.status === 'COMPLETED') {
      throw new BadRequestError('Cannot send invitation for a cancelled or completed activity');
    }

    // 4. Capacity full check
    activityPermissionService.validateCapacityNotReached(activity);

    // 5. Validate invited user exists and is not deleted
    const user = await userRepository.findUserById(invitedUserId);
    if (!user || user.deletedAt) {
      throw new NotFoundError('Invited user not found');
    }

    // 6. Check self-invitation
    if (invitedUserId === invitedById) {
      throw new BadRequestError('You cannot invite yourself to an activity');
    }

    // 7. Check organizer-invitation
    if (activity.organizerId === invitedUserId) {
      throw new BadRequestError('You cannot invite the organizer of the activity');
    }

    // 8. Check existing participant (ACCEPTED)
    const existingPart = await participantRepository.findParticipant(activityId, invitedUserId);
    if (existingPart && existingPart.status === 'ACCEPTED') {
      throw new ConflictError('User is already a participant in this activity');
    }

    // 9. Check duplicate invite
    const duplicate = await invitationRepository.findPending(activityId, invitedUserId);
    if (duplicate) {
      throw new ConflictError('A pending invitation already exists for this user');
    }

    const expiryDate = expiresAt ? new Date(expiresAt) : undefined;

    const invitation = await invitationRepository.create(
      activityId,
      invitedUserId,
      invitedById,
      message,
      expiryDate
    );

    return this.mapToDTO(invitation);
  }

  /**
   * Accepts a pending invitation.
   */
  public async acceptInvitation(userId: string, invitationId: string): Promise<InvitationDTO> {
    const invitation = await invitationRepository.findById(invitationId);
    if (!invitation || invitation.invitedUserId !== userId) {
      throw new NotFoundError('Invitation not found');
    }

    if (invitation.status === 'ACCEPTED') {
      throw new ConflictError('Invitation has already been accepted');
    }
    if (invitation.status === 'DECLINED') {
      throw new ConflictError('Invitation has already been declined');
    }
    if (invitation.status === 'CANCELLED') {
      throw new ConflictError('Invitation has been cancelled');
    }
    if (invitation.status === 'EXPIRED') {
      throw new ConflictError('Invitation has expired');
    }

    // Expiry check
    if (invitation.expiresAt && new Date() > new Date(invitation.expiresAt)) {
      // Mark status as EXPIRED
      await invitationRepository.updateStatus(invitationId, InvitationStatus.EXPIRED);
      throw new BadRequestError('Invitation has expired and cannot be accepted');
    }

    // Activity status check
    const activity = await activityPermissionService.getAndValidateActiveActivity(invitation.activityId);
    if (activity.status === 'CANCELLED' || activity.status === 'COMPLETED') {
      throw new BadRequestError('Cannot accept invitation for a cancelled or completed activity');
    }

    // Capacity full check
    activityPermissionService.validateCapacityNotReached(activity);

    // Run transaction
    await prisma.$transaction(async (tx) => {
      // 1. Upsert participant status to ACCEPTED
      await invitationRepository.upsertParticipant(invitation.activityId, userId, tx);

      // 2. Update invitation status to ACCEPTED
      await invitationRepository.updateStatus(invitationId, InvitationStatus.ACCEPTED, tx);
    });

    // FUTURE: Publish event to Kafka -> Notification Service

    const result = await invitationRepository.findById(invitationId);
    if (!result) {
      throw new NotFoundError('Invitation not found after update');
    }
    return this.mapToDTO(result);
  }

  /**
   * Rejects a pending invitation.
   */
  public async rejectInvitation(userId: string, invitationId: string): Promise<InvitationDTO> {
    const invitation = await invitationRepository.findById(invitationId);
    if (!invitation || invitation.invitedUserId !== userId) {
      throw new NotFoundError('Invitation not found');
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new BadRequestError(`Invitation cannot be rejected from status ${invitation.status}`);
    }

    // Expiry check
    if (invitation.expiresAt && new Date() > new Date(invitation.expiresAt)) {
      await invitationRepository.updateStatus(invitationId, InvitationStatus.EXPIRED);
      throw new BadRequestError('Invitation has expired');
    }

    await invitationRepository.updateStatus(invitationId, InvitationStatus.DECLINED);

    const result = await invitationRepository.findById(invitationId);
    if (!result) {
      throw new NotFoundError('Invitation not found after update');
    }
    return this.mapToDTO(result);
  }

  /**
   * Cancels a pending invitation.
   */
  public async cancelInvitation(organizerId: string, invitationId: string): Promise<InvitationDTO> {
    const invitation = await invitationRepository.findById(invitationId);
    if (!invitation) {
      throw new NotFoundError('Invitation not found');
    }

    // Validate caller is organizer of the activity
    if (invitation.activity.organizerId !== organizerId) {
      throw new ForbiddenError('Only the activity organizer can cancel invitations');
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new BadRequestError(`Invitation cannot be cancelled from status ${invitation.status}`);
    }

    await invitationRepository.updateStatus(invitationId, InvitationStatus.CANCELLED);

    const result = await invitationRepository.findById(invitationId);
    if (!result) {
      throw new NotFoundError('Invitation not found after update');
    }
    return this.mapToDTO(result);
  }

  /**
   * Lists sent invitations for an activity.
   */
  public async listSent(organizerId: string, activityId: string): Promise<InvitationDTO[]> {
    const activity = await activityPermissionService.getAndValidateActiveActivity(activityId);
    activityPermissionService.validateIsOrganizer(activity, organizerId);

    const invitations = await invitationRepository.findByActivity(activityId);
    return invitations.map((inv: any) => this.mapToDTO(inv));
  }

  /**
   * Lists received invitations for the current user.
   */
  public async listReceived(userId: string): Promise<InvitationDTO[]> {
    const invitations = await invitationRepository.findByInvitedUser(userId);
    return invitations.map((inv: any) => this.mapToDTO(inv));
  }

  /**
   * Map database model to InvitationDTO.
   */
  private mapToDTO(inv: any): InvitationDTO {
    return {
      id: inv.id,
      activity: {
        id: inv.activity.id,
        title: inv.activity.title,
        startsAt: inv.activity.startsAt,
      },
      invitedBy: inv.invitedBy
        ? {
            id: inv.invitedBy.id,
            name: inv.invitedBy.name,
          }
        : undefined,
      status: inv.status,
      message: inv.message,
      expiresAt: inv.expiresAt,
      respondedAt: inv.respondedAt,
      distance: null,
    };
  }
}

export const invitationService = new InvitationService();
export default invitationService;
