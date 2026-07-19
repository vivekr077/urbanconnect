import type { Request, Response } from 'express';
import { participantService } from './participant.service.js';
import { sendSuccessResponse } from '../../utils/response.js';
import { HttpStatus } from '../../constants/httpStatus.js';
import { UnauthorizedError, BadRequestError } from '../../errors/customErrors.js';

export class ParticipantController {
  /**
   * Request to join an activity.
   */
  public joinActivity = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('User context not found in request');
    }

    const { activityId } = req.params;
    if (typeof activityId !== 'string') {
      throw new BadRequestError('Activity ID parameter is missing or invalid');
    }

    const result = await participantService.joinActivity(req.user.id, activityId);
    sendSuccessResponse(res, HttpStatus.CREATED, result.message);
  };

  /**
   * Leaves an activity.
   */
  public leaveActivity = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('User context not found in request');
    }

    const { activityId } = req.params;
    if (typeof activityId !== 'string') {
      throw new BadRequestError('Activity ID parameter is missing or invalid');
    }

    const result = await participantService.leaveActivity(req.user.id, activityId);
    sendSuccessResponse(res, HttpStatus.OK, result.message);
  };

  /**
   * Accepts a participant join request.
   */
  public acceptParticipant = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('User context not found in request');
    }

    const { activityId, participantId } = req.params;
    if (typeof activityId !== 'string' || typeof participantId !== 'string') {
      throw new BadRequestError('Activity ID or Participant ID parameter is missing or invalid');
    }

    const result = await participantService.acceptParticipant(req.user.id, activityId, participantId);
    sendSuccessResponse(res, HttpStatus.OK, result.message);
  };

  /**
   * Rejects a participant join request.
   */
  public rejectParticipant = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('User context not found in request');
    }

    const { activityId, participantId } = req.params;
    if (typeof activityId !== 'string' || typeof participantId !== 'string') {
      throw new BadRequestError('Activity ID or Participant ID parameter is missing or invalid');
    }

    const result = await participantService.rejectParticipant(req.user.id, activityId, participantId);
    sendSuccessResponse(res, HttpStatus.OK, result.message);
  };

  /**
   * Removes a participant from an activity.
   */
  public removeParticipant = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('User context not found in request');
    }

    const { activityId, participantId } = req.params;
    if (typeof activityId !== 'string' || typeof participantId !== 'string') {
      throw new BadRequestError('Activity ID or Participant ID parameter is missing or invalid');
    }

    const result = await participantService.removeParticipant(req.user.id, activityId, participantId);
    sendSuccessResponse(res, HttpStatus.OK, result.message);
  };

  /**
   * Retrieves the authenticated user's participation status.
   */
  public getParticipantMe = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('User context not found in request');
    }

    const { activityId } = req.params;
    if (typeof activityId !== 'string') {
      throw new BadRequestError('Activity ID parameter is missing or invalid');
    }

    const status = await participantService.getParticipantMe(req.user.id, activityId);
    sendSuccessResponse(res, HttpStatus.OK, 'My participation status retrieved successfully', status);
  };

  /**
   * Retrieves the accepted participants list.
   */
  public listParticipants = async (req: Request, res: Response): Promise<void> => {
    const { activityId } = req.params;
    if (typeof activityId !== 'string') {
      throw new BadRequestError('Activity ID parameter is missing or invalid');
    }

    const participants = await participantService.listParticipants(activityId);
    sendSuccessResponse(res, HttpStatus.OK, 'Participants retrieved successfully', participants);
  };

  /**
   * Retrieves pending participant requests (Organizer only).
   */
  public listPendingRequests = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('User context not found in request');
    }

    const { activityId } = req.params;
    if (typeof activityId !== 'string') {
      throw new BadRequestError('Activity ID parameter is missing or invalid');
    }

    const requests = await participantService.listPendingRequests(req.user.id, activityId);
    sendSuccessResponse(res, HttpStatus.OK, 'Pending requests retrieved successfully', requests);
  };
}

export const participantController = new ParticipantController();
export default participantController;
