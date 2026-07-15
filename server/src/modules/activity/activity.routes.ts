import { Router } from 'express';
import { activityController } from './activity.controller.js';
import {
  CreateActivitySchema,
  UpdateActivitySchema,
  NearbyActivitySchema,
  ActivityIdParamSchema,
  ListActivitiesSchema,
} from './activity.schema.js';
import { validate } from '../../middlewares/validate.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const router = Router();

// Create a new activity (authenticated user becomes organizer)
router.post('/', authenticate, validate(CreateActivitySchema), asyncHandler(activityController.createActivity));

// Get all activities (public route, supports filters & pagination)
router.get('/', validate(ListActivitiesSchema), asyncHandler(activityController.listActivities));

// Get activities organized by current user (requires authentication, place before /:id)
router.get('/my', authenticate, validate(ListActivitiesSchema), asyncHandler(activityController.getMyActivities));

// Find nearby activities using PostGIS (public route, defined before /:id)
router.get('/nearby', validate(NearbyActivitySchema), asyncHandler(activityController.getNearbyActivities));

// Retrieve details for a specific activity (public route)
router.get('/:id', validate(ActivityIdParamSchema), asyncHandler(activityController.getActivityDetails));

// Retrieve participants for a specific activity (public route)
router.get('/:id/participants', validate(ActivityIdParamSchema), asyncHandler(activityController.getActivityParticipants));

// Update an activity (organizer only, authenticates first, checks ownership inside service)
router.patch('/:id', authenticate, validate(ActivityIdParamSchema), validate(UpdateActivitySchema), asyncHandler(activityController.updateActivity));

// Delete an activity (soft delete, organizer only, authenticates first, checks ownership inside service)
router.delete('/:id', authenticate, validate(ActivityIdParamSchema), asyncHandler(activityController.deleteActivity));

export default router;
