import { Router } from 'express';
import { authController } from './auth.controller.js';
import { RegisterSchema, LoginSchema } from './auth.schema.js';
import { validate } from '../../middlewares/validate.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const router = Router();

router.post('/register', validate(RegisterSchema), asyncHandler(authController.register));
router.post('/login', validate(LoginSchema), asyncHandler(authController.login));
router.post('/logout', authenticate, asyncHandler(authController.logout));
router.get('/me', authenticate, asyncHandler(authController.me));

export default router;
