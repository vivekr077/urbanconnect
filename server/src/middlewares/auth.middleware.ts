import type { Request, Response, NextFunction } from 'express';
import tokenService from '../modules/auth/token.service.js';
import { UnauthorizedError, ForbiddenError, NotFoundError } from '../errors/customErrors.js';
import { ErrorMessages } from '../constants/messages.js';
import prisma from '../lib/prisma.js';
import { AccountStatus } from '../generated/prisma/client.js';

/**
 * Middleware to authenticate requests using JWT tokens in the Authorization header.
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError(ErrorMessages.UNAUTHORIZED));
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return next(new UnauthorizedError(ErrorMessages.UNAUTHORIZED));
  }

  try {
    const payload = tokenService.verifyToken(token);
    req.user = {
      id: payload.id,
      email: payload.email,
    };
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return next(new UnauthorizedError(ErrorMessages.TOKEN_EXPIRED));
    }
    return next(new UnauthorizedError(ErrorMessages.TOKEN_INVALID));
  }
};

/**
 * Middleware to authorize requests based on user account status.
 * @param allowedStatuses List of acceptable AccountStatus values
 */
export const authorizeStatus = (allowedStatuses: AccountStatus[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      return next(new UnauthorizedError(ErrorMessages.UNAUTHORIZED));
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { accountStatus: true, deletedAt: true },
      });

      if (!user || user.deletedAt !== null) {
        return next(new NotFoundError('User account not found'));
      }

      if (!allowedStatuses.includes(user.accountStatus)) {
        return next(new ForbiddenError('Your account status does not permit this action'));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
