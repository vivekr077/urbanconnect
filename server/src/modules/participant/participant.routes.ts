import { Router } from 'express';
import { participantController } from './participant.controller.js';
import { ActivityIdParamSchema, ParticipantManageParamSchema } from './participant.schema.js';
import { validate } from '../../middlewares/validate.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const router = Router();

// Get My Participation Status (Protected)
router.get(
  '/:activityId/participants/me',
  authenticate,
  validate(ActivityIdParamSchema),
  asyncHandler(participantController.getParticipantMe)
);

// Pending Requests (Protected)
router.get(
  '/:activityId/participants/pending',
  authenticate,
  validate(ActivityIdParamSchema),
  asyncHandler(participantController.listPendingRequests)
);

// Get Participants (Public)
router.get(
  '/:activityId/participants',
  validate(ActivityIdParamSchema),
  asyncHandler(participantController.listParticipants)
);

// Accept Request (Protected)
router.patch(
  '/:activityId/participants/:participantId/accept',
  authenticate,
  validate(ParticipantManageParamSchema),
  asyncHandler(participantController.acceptParticipant)
);

// Reject Request (Protected)
router.patch(
  '/:activityId/participants/:participantId/reject',
  authenticate,
  validate(ParticipantManageParamSchema),
  asyncHandler(participantController.rejectParticipant)
);

// Remove Participant (Protected)
router.delete(
  '/:activityId/participants/:participantId',
  authenticate,
  validate(ParticipantManageParamSchema),
  asyncHandler(participantController.removeParticipant)
);

// Join Activity (Protected)
router.post(
  '/:activityId/join',
  authenticate,
  validate(ActivityIdParamSchema),
  asyncHandler(participantController.joinActivity)
);

// Leave Activity (Protected)
router.delete(
  '/:activityId/leave',
  authenticate,
  validate(ActivityIdParamSchema),
  asyncHandler(participantController.leaveActivity)
);

export default router;
