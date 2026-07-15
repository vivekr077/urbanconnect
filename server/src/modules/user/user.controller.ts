import type { Request, Response } from 'express';
import { userService } from './user.service.js';
import { sendSuccessResponse } from '../../utils/response.js';
import { HttpStatus } from '../../constants/httpStatus.js';
import { UnauthorizedError, BadRequestError } from '../../errors/customErrors.js';

export class UserController {
  /**
   * Controller to update the authenticated user's profile.
   */
  public updateProfile = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('User context not found in request');
    }

    const updatedUser = await userService.updateProfile(req.user.id, req.body);
    sendSuccessResponse(res, HttpStatus.OK, 'Profile updated successfully', updatedUser);
  };

  /**
   * Controller to retrieve the authenticated user's own profile.
   */
  public getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('User context not found in request');
    }

    const profile = await userService.getProfile(req.user.id);
    sendSuccessResponse(res, HttpStatus.OK, 'Profile retrieved successfully', profile);
  };

  /**
   * Controller to retrieve any user's profile details by their ID.
   */
  public getProfile = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (typeof id !== 'string') {
      throw new BadRequestError('User ID parameter is missing or invalid');
    }
    const profile = await userService.getProfile(id);
    sendSuccessResponse(res, HttpStatus.OK, 'Profile retrieved successfully', profile);
  };

  /**
   * Controller to update the authenticated user's location coordinates.
   */
  public updateLocation = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('User context not found in request');
    }

    const { latitude, longitude } = req.body;
    const location = await userService.updateLocation(req.user.id, latitude, longitude);
    sendSuccessResponse(res, HttpStatus.OK, 'Location updated successfully', location);
  };

  /**
   * Controller to configure/overwrite the authenticated user's sports.
   */
  public updateSports = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('User context not found in request');
    }

    const { sports } = req.body;
    const configuredSports = await userService.updateSports(req.user.id, sports);
    sendSuccessResponse(res, HttpStatus.OK, 'Sports configuration updated successfully', configuredSports);
  };
}

export const userController = new UserController();
export default userController;
