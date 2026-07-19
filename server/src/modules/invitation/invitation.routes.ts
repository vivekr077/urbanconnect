import { Router } from 'express';
import { invitationController } from './invitation.controller.js';
import {
  SendInvitationSchema,
  GetActivityInvitationsSchema,
  InvitationIdParamSchema,
  ListReceivedInvitationsSchema,
} from './invitation.schema.js';
import { validate } from '../../middlewares/validate.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const router = Router();

// Send Invitation (Protected)
router.post(
  '/activities/:activityId/invitations',
  authenticate,
  validate(SendInvitationSchema),
  asyncHandler(invitationController.sendInvitation)
);

// List Sent Invitations (Protected, Organizer only check is in service)
router.get(
  '/activities/:activityId/invitations',
  authenticate,
  validate(GetActivityInvitationsSchema),
  asyncHandler(invitationController.listSent)
);

// List Received Invitations (Protected)
router.get(
  '/users/me/invitations',
  authenticate,
  validate(ListReceivedInvitationsSchema),
  asyncHandler(invitationController.listReceived)
);

// Accept Invitation (Protected)
router.patch(
  '/invitations/:invitationId/accept',
  authenticate,
  validate(InvitationIdParamSchema),
  asyncHandler(invitationController.acceptInvitation)
);

// Reject Invitation (Protected)
router.patch(
  '/invitations/:invitationId/reject',
  authenticate,
  validate(InvitationIdParamSchema),
  asyncHandler(invitationController.rejectInvitation)
);

// Cancel/Delete Invitation (Protected, Organizer only check is in service)
router.delete(
  '/invitations/:invitationId',
  authenticate,
  validate(InvitationIdParamSchema),
  asyncHandler(invitationController.cancelInvitation)
);

export default router;
