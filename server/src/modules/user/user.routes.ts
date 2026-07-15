import { Router } from 'express';
import { userController } from './user.controller.js';
import { UpdateProfileSchema, UpdateLocationSchema, UpdateSportsSchema } from './user.schema.js';
import { validate } from '../../middlewares/validate.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const router = Router();

// Retrieve authenticated user profile details
router.get('/me', authenticate, asyncHandler(userController.getCurrentUser));

// Update authenticated user profile details
router.patch('/me', authenticate, validate(UpdateProfileSchema), asyncHandler(userController.updateProfile));

// Update authenticated user spatial location coordinates
router.patch('/me/location', authenticate, validate(UpdateLocationSchema), asyncHandler(userController.updateLocation));

// Configure/overwrite authenticated user sports
router.patch('/me/sports', authenticate, validate(UpdateSportsSchema), asyncHandler(userController.updateSports));

// Retrieve any user's profile details by their ID
router.get('/:id', authenticate, asyncHandler(userController.getProfile));

export default router;
