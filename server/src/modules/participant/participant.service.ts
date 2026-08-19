import { participantRepository } from './participant.repository.js';
import { activityPermissionService } from '../activity/activityPermission.service.js';
import { NotFoundError, ForbiddenError, BadRequestError, ConflictError } from '../../errors/customErrors.js';
import { ParticipantStatus, ActivityStatus, ParticipantRole } from '../../generated/prisma/client.js';
import type { ParticipantResponse, ParticipantMeResponse } from './participant.types.js';

export class ParticipantService {
  /**
   * Request to join an activity.
   * Business Rules:
   * Join: Activity Exists -> Not Deleted -> Status == OPEN -> Slots Available -> User Not Already Participant -> Create Participant
   */
  public async joinActivity(userId: string, activityId: string): Promise<{ success: boolean; message: string }> {
    // 1. Get and validate active activity (checks: Exists -> Not Deleted)
    const activity = await activityPermissionService.getAndValidateActiveActivity(activityId);

    // 2. Ensure activity is open (checks: Status == OPEN)
    activityPermissionService.validateIsOpen(activity);

    // 3. Organizer cannot join own activity (already a participant)
    if (activity.organizerId === userId) {
      throw new BadRequestError('Organizer cannot join their own activity');
    }

    // 4. Ensure capacity has not been reached (checks: Slots Available)
    activityPermissionService.validateCapacityNotReached(activity);

    // 5. Check if already registered (checks: User Not Already Participant)
    const existing = await participantRepository.findParticipant(activityId, userId);
    const targetStatus = activity.joinApprovalRequired ? ParticipantStatus.PENDING : ParticipantStatus.ACCEPTED;

    if (existing) {
      if (existing.status === ParticipantStatus.ACCEPTED) {
        throw new ConflictError('You are already a participant in this activity');
      }
      if (existing.status === ParticipantStatus.PENDING) {
        throw new ConflictError('Your join request is already pending');
      }
      if (existing.status === ParticipantStatus.REJECTED) {
        throw new ConflictError('Your join request was rejected by the organizer');
      }
      if (existing.status === ParticipantStatus.LEFT) {
        // Allow re-requesting/joining if they previously left
        await participantRepository.updateRequestStatus(existing.id, targetStatus);
        return {
          success: true,
          message: targetStatus === ParticipantStatus.ACCEPTED ? 'Joined activity successfully' : 'Join request sent successfully',
        };
      }
    }

    // 6. Create join request (Create Participant)
    await participantRepository.createJoinRequest(activityId, userId, targetStatus);
    return {
      success: true,
      message: targetStatus === ParticipantStatus.ACCEPTED ? 'Joined activity successfully' : 'Join request sent successfully',
    };
  }

  /**
   * Accepts a pending participant request.
   * Business Rules:
   * Accept: Organizer? -> Participant Pending? -> Accept
   */
  public async acceptParticipant(
    organizerId: string,
    activityId: string,
    participantId: string
  ): Promise<{ success: boolean; message: string }> {
    // 1. Validate activity exists and user is organizer (checks: Organizer?)
    const activity = await activityPermissionService.getAndValidateActiveActivity(activityId);
    activityPermissionService.validateIsOrganizer(activity, organizerId);

    // 2. Validate participant request exists
    const participant = await participantRepository.findParticipantById(participantId);
    if (!participant || participant.activityId !== activityId) {
      throw new NotFoundError('Participant request not found');
    }

    // 3. Validate participant is pending (checks: Participant Pending?)
    if (participant.status === ParticipantStatus.ACCEPTED) {
      throw new ConflictError('Participant has already been accepted');
    }
    if (participant.status !== ParticipantStatus.PENDING) {
      throw new BadRequestError('Only pending requests can be accepted');
    }

    // Capacity check
    activityPermissionService.validateCapacityNotReached(activity);

    // 4. Accept participant
    await participantRepository.updateStatus(participantId, ParticipantStatus.ACCEPTED, organizerId);
    return {
      success: true,
      message: 'Participant request accepted successfully',
    };
  }

  /**
   * Rejects a pending participant request.
   * Business Rules:
   * Reject: Organizer? -> Pending? -> Reject
   */
  public async rejectParticipant(
    organizerId: string,
    activityId: string,
    participantId: string
  ): Promise<{ success: boolean; message: string }> {
    // 1. Validate activity exists and user is organizer (checks: Organizer?)
    const activity = await activityPermissionService.getAndValidateActiveActivity(activityId);
    activityPermissionService.validateIsOrganizer(activity, organizerId);

    // 2. Validate participant request exists
    const participant = await participantRepository.findParticipantById(participantId);
    if (!participant || participant.activityId !== activityId) {
      throw new NotFoundError('Participant request not found');
    }

    // 3. Validate participant is pending (checks: Pending?)
    if (participant.status !== ParticipantStatus.PENDING) {
      throw new BadRequestError('Only pending requests can be rejected');
    }

    // 4. Reject request
    await participantRepository.updateStatus(participantId, ParticipantStatus.REJECTED);
    return {
      success: true,
      message: 'Participant request rejected successfully',
    };
  }

  /**
   * Leaves an activity.
   * Business Rules:
   * Leave: Participant Exists -> Organizer? -> No -> Leave, Yes -> Reject (Organizer cannot leave own activity)
   */
  public async leaveActivity(userId: string, activityId: string): Promise<{ success: boolean; message: string }> {
    const activity = await activityPermissionService.getAndValidateActiveActivity(activityId);

    // Prevent leaving if activity completed or already ended
    if (new Date(activity.endsAt) <= new Date() || activity.status === ActivityStatus.COMPLETED) {
      throw new BadRequestError('Cannot leave an activity that has already ended or completed');
    }

    // Organizer cannot leave own activity (checks: Organizer? -> Yes -> Reject)
    if (activity.organizerId === userId) {
      throw new BadRequestError('Organizer cannot leave their own activity. Please delete the activity instead.');
    }

    // Check if participant exists (checks: Participant Exists?)
    const participant = await participantRepository.findParticipant(activityId, userId);
    if (!participant || (participant.status !== ParticipantStatus.ACCEPTED && participant.status !== ParticipantStatus.PENDING)) {
      throw new NotFoundError('You are not an active participant in this activity');
    }

    // Organizer? -> No -> Leave
    await participantRepository.updateStatus(participant.id, ParticipantStatus.LEFT);
    return {
      success: true,
      message: 'You have left the activity successfully',
    };
  }

  /**
   * Removes a participant (Organizer only).
   * Business Rules:
   * Remove: Organizer? -> Participant Exists? -> Remove
   */
  public async removeParticipant(
    organizerId: string,
    activityId: string,
    participantId: string
  ): Promise<{ success: boolean; message: string }> {
    // 1. Validate activity exists and user is organizer (checks: Organizer?)
    const activity = await activityPermissionService.getAndValidateActiveActivity(activityId);
    activityPermissionService.validateIsOrganizer(activity, organizerId);

    // 2. Validate participant exists (checks: Participant Exists?)
    const participant = await participantRepository.findParticipantById(participantId);
    if (!participant || participant.activityId !== activityId) {
      throw new NotFoundError('Participant not found');
    }

    if (participant.userId === organizerId) {
      throw new BadRequestError('Organizer cannot be removed from the activity');
    }

    // 3. Remove participant
    await participantRepository.deleteParticipant(participantId);
    return {
      success: true,
      message: 'Participant removed successfully',
    };
  }

  /**
   * Retrieves the authenticated user's participation status.
   */
  public async getParticipantMe(userId: string, activityId: string): Promise<ParticipantMeResponse> {
    await activityPermissionService.getAndValidateActiveActivity(activityId);
    const participant = await participantRepository.findParticipant(activityId, userId);
    
    if (!participant) {
      return { status: null, role: null };
    }
    
    return {
      status: participant.status,
      role: participant.role,
    };
  }

  /**
   * Exposes public participants list.
   */
  public async listParticipants(activityId: string): Promise<ParticipantResponse[]> {
    await activityPermissionService.getAndValidateActiveActivity(activityId);

    const participants = await participantRepository.listParticipants(activityId, ParticipantStatus.ACCEPTED);
    return participants.map((p) => ({
      id: p.id,
      activityId: p.activityId,
      userId: p.userId,
      role: p.role,
      status: p.status,
      requestedAt: p.requestedAt,
      approvedAt: p.approvedAt,
      approvedById: p.approvedById,
      updatedAt: p.updatedAt,
      user: {
        id: p.user.id,
        name: p.user.name,
        profileImageUrl: p.user.profileImageUrl,
        trustScore: p.user.trustScore,
      },
    }));
  }

  /**
   * Exposes pending requests list (Organizer only).
   */
  public async listPendingRequests(organizerId: string, activityId: string): Promise<ParticipantResponse[]> {
    const activity = await activityPermissionService.getAndValidateActiveActivity(activityId);
    activityPermissionService.validateIsOrganizer(activity, organizerId);

    const participants = await participantRepository.listParticipants(activityId, ParticipantStatus.PENDING);
    return participants.map((p) => ({
      id: p.id,
      activityId: p.activityId,
      userId: p.userId,
      role: p.role,
      status: p.status,
      requestedAt: p.requestedAt,
      approvedAt: p.approvedAt,
      approvedById: p.approvedById,
      updatedAt: p.updatedAt,
      user: {
        id: p.user.id,
        name: p.user.name,
        profileImageUrl: p.user.profileImageUrl,
        trustScore: p.user.trustScore,
      },
    }));
  }
}

export const participantService = new ParticipantService();
export default participantService;
