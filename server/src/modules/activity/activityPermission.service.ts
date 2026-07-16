import { activityRepository } from './activity.repository.js';
import { NotFoundError, ForbiddenError, BadRequestError, ConflictError } from '../../errors/customErrors.js';

export class ActivityPermissionService {
  /**
   * Fetches an activity and ensures it exists and is not deleted.
   * @param activityId Activity UUID
   */
  public async getAndValidateActiveActivity(activityId: string) {
    const activity = await activityRepository.findById(activityId);
    if (!activity) {
      throw new NotFoundError('Activity not found');
    }
    return activity;
  }

  /**
   * Validates if a user is the organizer of the activity.
   * @param activity Activity object (from findById)
   * @param userId User UUID
   */
  public validateIsOrganizer(activity: any, userId: string): void {
    if (activity.organizerId !== userId) {
      throw new ForbiddenError('Only the activity organizer can perform this action');
    }
  }

  /**
   * Validates if the activity capacity is full.
   * @param activity Activity object (from findById)
   */
  public validateCapacityNotReached(activity: any): void {
    const participantCount = activity.participants.length;
    if (participantCount >= activity.maxParticipants) {
      throw new ConflictError('Activity capacity has been reached');
    }
  }

  /**
   * Validates if the activity is open for joins.
   * @param activity Activity object (from findById)
   */
  public validateIsOpen(activity: any): void {
    if (activity.status !== 'OPEN') {
      throw new BadRequestError(`Cannot join activity that is currently ${activity.status.toLowerCase()}`);
    }
    if (new Date(activity.startsAt) <= new Date()) {
      throw new BadRequestError('Cannot join an activity that has already started or completed');
    }
  }
}

export const activityPermissionService = new ActivityPermissionService();
export default activityPermissionService;
