import type { Request, Response } from 'express';
import { invitationService } from './invitation.service.js';
import { HttpStatus } from '../../constants/httpStatus.js';
import { sendSuccessResponse } from '../../utils/response.js';
import { UnauthorizedError } from '../../errors/customErrors.js';
import type { ListInvitationQuery } from './invitation.types.js';

export class InvitationController {
  public sendInvitation = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('User context not found in request');
    }

    const activityId = req.params.activityId as string;
    const { invitedUserId, message, expiresAt } = req.body;

    const invitation = await invitationService.sendInvitation(req.user.id, activityId, {
      invitedUserId,
      message,
      expiresAt,
    });

    sendSuccessResponse(res, HttpStatus.CREATED, 'Invitation sent successfully', invitation);
  };

  public acceptInvitation = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('User context not found in request');
    }

    const invitationId = req.params.invitationId as string;

    const invitation = await invitationService.acceptInvitation(req.user.id, invitationId);

    sendSuccessResponse(res, HttpStatus.OK, 'Invitation accepted successfully', invitation);
  };

  public rejectInvitation = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('User context not found in request');
    }

    const invitationId = req.params.invitationId as string;

    const invitation = await invitationService.rejectInvitation(req.user.id, invitationId);

    sendSuccessResponse(res, HttpStatus.OK, 'Invitation rejected successfully', invitation);
  };

  public cancelInvitation = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('User context not found in request');
    }

    const invitationId = req.params.invitationId as string;

    const invitation = await invitationService.cancelInvitation(req.user.id, invitationId);

    sendSuccessResponse(res, HttpStatus.OK, 'Invitation cancelled successfully', invitation);
  };

  public listReceived = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('User context not found in request');
    }

    const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
    const status = req.query.status as string | undefined;

    const query: ListInvitationQuery = {};
    if (page !== undefined) query.page = page;
    if (limit !== undefined) query.limit = limit;
    if (status !== undefined) query.status = status;

    const invitations = await invitationService.listReceived(req.user.id, query);

    sendSuccessResponse(res, HttpStatus.OK, 'Received invitations retrieved successfully', invitations);
  };

  public listSent = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('User context not found in request');
    }

    const activityId = req.params.activityId as string;

    const invitations = await invitationService.listSent(req.user.id, activityId);

    sendSuccessResponse(res, HttpStatus.OK, 'Sent invitations retrieved successfully', invitations);
  };
}

export const invitationController = new InvitationController();
export default invitationController;
