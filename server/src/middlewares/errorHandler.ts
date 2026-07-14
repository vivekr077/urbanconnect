import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/customErrors.js';
import { HttpStatus } from '../constants/httpStatus.js';
import { ErrorMessages } from '../constants/messages.js';
import { Prisma } from '../generated/prisma/client.js';
import { ZodError } from 'zod';
import { logger } from '../lib/logger.js';
import { sendErrorResponse } from '../utils/response.js';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (res.headersSent) {
    return next(err);
  }

  let statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;
  let message: string = ErrorMessages.INTERNAL_SERVER_ERROR;
  let details: any = undefined;

  // AppError (Operational)
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }
  // Zod Validation Error
  else if (err instanceof ZodError) {
    statusCode = HttpStatus.BAD_REQUEST;
    message = ErrorMessages.VALIDATION_ERROR;
    details = err.issues.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
  }
  // Prisma Error
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      statusCode = HttpStatus.CONFLICT;
      const target = (err.meta?.target as string[]) || [];
      const fields = target.join(', ');
      message = fields ? `Unique constraint failed on field(s): ${fields}` : ErrorMessages.EMAIL_ALREADY_EXISTS;
    } else {
      statusCode = HttpStatus.BAD_REQUEST;
      message = `Database error: ${err.message}`;
    }
  }

  // Log error
  if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
    logger.error({ err, path: req.path, method: req.method }, 'Unhandled Exception');
  } else {
    logger.warn({ err: err.message, path: req.path, method: req.method, statusCode }, 'Operational Error');
  }

  sendErrorResponse(res, statusCode, message, details);
};

export default errorHandler;
