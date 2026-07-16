import type { Request, Response } from 'express';
import { invitationService } from './invitation.service.js';
import { sendSuccessResponse } from '../../utils/response.js';
import { HttpStatus } from '../../constants/httpStatus.js';
import { UnauthorizedError, BadRequestError } from '../../errors/customErrors.js';

export class InvitationController {
  /**
   * Sends an invitation to a user.
   */
  public sendInvitation = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('User context not found in request');
    }

    const { activityId } = req.params;
    if (typeof activityId !== 'string') {
      throw new BadRequestError('Activity ID parameter is missing or invalid');
    }

    const result = await invitationService.sendInvitation(req.user.id, activityId, req.body);
    sendSuccessResponse(res, HttpStatus.CREATED, 'Invitation sent successfully', result);
  };

  /**
   * Accepts an invitation.
   */
  public acceptInvitation = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('User context not found in request');
    }

    const { invitationId } = req.params;
    if (typeof invitationId !== 'string') {
      throw new BadRequestError('Invitation ID parameter is missing or invalid');
    }

    const result = await invitationService.acceptInvitation(req.user.id, invitationId);
    sendSuccessResponse(res, HttpStatus.OK, 'Invitation accepted successfully', result);
  };

  /**
   * Rejects an invitation.
   */
  public rejectInvitation = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('User context not found in request');
    }

    const { invitationId } = req.params;
    if (typeof invitationId !== 'string') {
      throw new BadRequestError('Invitation ID parameter is missing or invalid');
    }

    const result = await invitationService.rejectInvitation(req.user.id, invitationId);
    sendSuccessResponse(res, HttpStatus.OK, 'Invitation rejected successfully', result);
  };

  /**
   * Cancels an invitation.
   */
  public cancelInvitation = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('User context not found in request');
    }

    const { invitationId } = req.params;
    if (typeof invitationId !== 'string') {
      throw new BadRequestError('Invitation ID parameter is missing or invalid');
    }

    const result = await invitationService.cancelInvitation(req.user.id, invitationId);
    sendSuccessResponse(res, HttpStatus.OK, 'Invitation cancelled successfully', result);
  };

  /**
   * Lists invitations sent for an activity.
   */
  public listSent = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('User context not found in request');
    }

    const { activityId } = req.params;
    if (typeof activityId !== 'string') {
      throw new BadRequestError('Activity ID parameter is missing or invalid');
    }

    const result = await invitationService.listSent(req.user.id, activityId);
    sendSuccessResponse(res, HttpStatus.OK, 'Sent invitations retrieved successfully', result);
  };

  /**
   * Lists invitations received by the current user.
   */
  public listReceived = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('User context not found in request');
    }

    const result = await invitationService.listReceived(req.user.id);
    sendSuccessResponse(res, HttpStatus.OK, 'Received invitations retrieved successfully', result);
  };
}

export const invitationController = new InvitationController();
export default invitationController;
