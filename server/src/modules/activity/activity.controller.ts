import type { Request, Response } from 'express';
import { activityService } from './activity.service.js';
import { sendSuccessResponse } from '../../utils/response.js';
import { HttpStatus } from '../../constants/httpStatus.js';
import { UnauthorizedError, BadRequestError } from '../../errors/customErrors.js';

export class ActivityController {
  /**
   * Endpoint to create an activity.
   */
  public createActivity = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('User context not found in request');
    }

    const activity = await activityService.createActivity(req.user.id, req.body);
    sendSuccessResponse(res, HttpStatus.CREATED, 'Activity created successfully', activity);
  };

  /**
   * Endpoint to retrieve details of a specific activity.
   */
  public getActivityDetails = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (typeof id !== 'string') {
      throw new BadRequestError('Activity ID parameter is missing or invalid');
    }

    const activity = await activityService.getActivityDetails(id);
    sendSuccessResponse(res, HttpStatus.OK, 'Activity retrieved successfully', activity);
  };

  /**
   * Endpoint to list all activities with filters and pagination.
   */
  public listActivities = async (req: Request, res: Response): Promise<void> => {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
    const latitude = req.query.latitude ? parseFloat(req.query.latitude as string) : undefined;
    const longitude = req.query.longitude ? parseFloat(req.query.longitude as string) : undefined;

    const result = await activityService.listActivities({
      ...req.query,
      page,
      limit,
      latitude,
      longitude,
    } as any);

    // Using the custom paginated response format
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Activities retrieved successfully',
      data: result.data,
      pagination: result.pagination,
      timestamp: new Date().toISOString(),
    });
  };

  /**
   * Endpoint to update an existing activity.
   */
  public updateActivity = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('User context not found in request');
    }

    const { id } = req.params;
    if (typeof id !== 'string') {
      throw new BadRequestError('Activity ID parameter is missing or invalid');
    }

    const updated = await activityService.updateActivity(req.user.id, id, req.body);
    sendSuccessResponse(res, HttpStatus.OK, 'Activity updated successfully', updated);
  };

  /**
   * Endpoint to delete/soft delete an activity.
   */
  public deleteActivity = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('User context not found in request');
    }

    const { id } = req.params;
    if (typeof id !== 'string') {
      throw new BadRequestError('Activity ID parameter is missing or invalid');
    }

    await activityService.deleteActivity(req.user.id, id);
    sendSuccessResponse(res, HttpStatus.OK, 'Activity deleted successfully');
  };

  /**
   * Endpoint to find activities within a given radius using PostGIS.
   */
  public getNearbyActivities = async (req: Request, res: Response): Promise<void> => {
    const rawLat = req.query.latitude ?? req.query.lat;
    const rawLng = req.query.longitude ?? req.query.lng;

    const latitude = rawLat ? parseFloat(rawLat as string) : undefined;
    const longitude = rawLng ? parseFloat(rawLng as string) : undefined;
    const radius = req.query.radius ? parseInt(req.query.radius as string, 10) : undefined;

    if (latitude === undefined || isNaN(latitude)) {
      throw new BadRequestError('Latitude is a required query parameter and must be a valid number');
    }
    if (longitude === undefined || isNaN(longitude)) {
      throw new BadRequestError('Longitude is a required query parameter and must be a valid number');
    }

    const activities = await activityService.getNearbyActivities(latitude, longitude, radius);
    sendSuccessResponse(res, HttpStatus.OK, 'Nearby activities retrieved successfully', activities);
  };

  /**
   * Endpoint to retrieve activities organized by the authenticated user.
   */
  public getMyActivities = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('User context not found in request');
    }

    const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;

    const result = await activityService.listActivities({
      ...req.query,
      organizerId: req.user.id,
      page,
      limit,
    } as any);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'My activities retrieved successfully',
      data: result.data,
      pagination: result.pagination,
      timestamp: new Date().toISOString(),
    });
  };

  /**
   * Endpoint to retrieve participants for a specific activity.
   */
  public getActivityParticipants = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (typeof id !== 'string') {
      throw new BadRequestError('Activity ID parameter is missing or invalid');
    }

    const participants = await activityService.getActivityParticipants(id);
    sendSuccessResponse(res, HttpStatus.OK, 'Activity participants retrieved successfully', participants);
  };
}

export const activityController = new ActivityController();
export default activityController;
