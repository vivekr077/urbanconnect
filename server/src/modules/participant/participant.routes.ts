import { Router } from 'express';
import { participantController } from './participant.controller.js';
import { ActivityIdParamSchema, ParticipantManageParamSchema } from './participant.schema.js';
import { validate } from '../../middlewares/validate.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const router = Router();

// Join Activity (Protected)
router.post(
  '/activities/:activityId/join',
  authenticate,
  validate(ActivityIdParamSchema),
  asyncHandler(participantController.joinActivity)
);

// Leave Activity (Protected)
router.delete(
  '/activities/:activityId/leave',
  authenticate,
  validate(ActivityIdParamSchema),
  asyncHandler(participantController.leaveActivity)
);

// Accept Request (Protected)
router.patch(
  '/activities/:activityId/participants/:participantId/accept',
  authenticate,
  validate(ParticipantManageParamSchema),
  asyncHandler(participantController.acceptParticipant)
);

// Reject Request (Protected)
router.patch(
  '/activities/:activityId/participants/:participantId/reject',
  authenticate,
  validate(ParticipantManageParamSchema),
  asyncHandler(participantController.rejectParticipant)
);

// Remove Participant (Protected)
router.delete(
  '/activities/:activityId/participants/:participantId',
  authenticate,
  validate(ParticipantManageParamSchema),
  asyncHandler(participantController.removeParticipant)
);

// Get Participants (Public)
router.get(
  '/activities/:activityId/participants',
  validate(ActivityIdParamSchema),
  asyncHandler(participantController.listParticipants)
);

// Pending Requests (Protected)
router.get(
  '/activities/:activityId/participants/pending',
  authenticate,
  validate(ActivityIdParamSchema),
  asyncHandler(participantController.listPendingRequests)
);

export default router;
