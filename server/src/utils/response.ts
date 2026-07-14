import type { Response } from 'express';
import { HttpStatus } from '../constants/httpStatus.js';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T | undefined;
  errors?: any | undefined;
  timestamp: string;
}

export const sendSuccessResponse = <T>(
  res: Response,
  statusCode: number = HttpStatus.OK,
  message: string,
  data?: T
): void => {
  const responseBody: ApiResponse<T> = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
  res.status(statusCode).json(responseBody);
};

export const sendErrorResponse = (
  res: Response,
  statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
  message: string,
  errors?: any
): void => {
  const responseBody: ApiResponse = {
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString(),
  };
  res.status(statusCode).json(responseBody);
};
