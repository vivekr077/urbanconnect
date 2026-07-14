import type { Request, Response } from 'express';
import { authService } from './auth.service.js';
import { sendSuccessResponse } from '../../utils/response.js';
import { HttpStatus } from '../../constants/httpStatus.js';
import { SuccessMessages } from '../../constants/messages.js';
import { UnauthorizedError } from '../../errors/customErrors.js';

export class AuthController {
  /**
   * Controller for user registration.
   */
  public register = async (req: Request, res: Response): Promise<void> => {
    const result = await authService.register(req.body);
    sendSuccessResponse(res, HttpStatus.CREATED, SuccessMessages.REGISTER_SUCCESS, result);
  };

  /**
   * Controller for user login.
   */
  public login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    sendSuccessResponse(res, HttpStatus.OK, SuccessMessages.LOGIN_SUCCESS, result);
  };

  /**
   * Controller for user logout (stateless endpoint for V1).
   */
  public logout = async (_req: Request, res: Response): Promise<void> => {
    sendSuccessResponse(res, HttpStatus.OK, SuccessMessages.LOGOUT_SUCCESS);
  };

  /**
   * Controller to get the current authenticated user's profile.
   */
  public me = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('User context not found in request');
    }
    const user = await authService.getUserProfile(req.user.id);
    sendSuccessResponse(res, HttpStatus.OK, SuccessMessages.PROFILE_RETRIEVED, user);
  };
}

export const authController = new AuthController();
export default authController;
