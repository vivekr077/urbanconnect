import { authRepository } from './auth.repository.js';
import { tokenService } from './token.service.js';
import { hashPassword, comparePassword } from '../../utils/password.js';
import { ConflictError, UnauthorizedError, NotFoundError } from '../../errors/customErrors.js';
import { ErrorMessages } from '../../constants/messages.js';
import type { SanitizedUser, AuthSuccessPayload } from './auth.types.js';
import { Prisma } from '../../generated/prisma/client.js';

export class AuthService {
  /**
   * Registers a new user.
   * Checks if user already exists, hashes password, saves to DB, and returns token.
   */
  public async register(data: Prisma.UserCreateInput): Promise<AuthSuccessPayload> {
    const existingUser = await authRepository.findUserByEmail(data.email);
    if (existingUser) {
      throw new ConflictError(ErrorMessages.EMAIL_ALREADY_EXISTS);
    }

    const hashedPassword = await hashPassword(data.password);
    
    const user = await authRepository.createUser({
      ...data,
      password: hashedPassword,
    });

    const token = tokenService.generateAccessToken({
      id: user.id,
      email: user.email,
    });

    const { password: _, ...sanitizedUser } = user;
    return {
      user: sanitizedUser,
      token,
    };
  }

  /**
   * Logs in a user.
   * Compares credentials and returns token.
   */
  public async login(email: string, password: string): Promise<AuthSuccessPayload> {
    const user = await authRepository.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedError(ErrorMessages.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError(ErrorMessages.INVALID_CREDENTIALS);
    }

    const token = tokenService.generateAccessToken({
      id: user.id,
      email: user.email,
    });

    const { password: _, ...sanitizedUser } = user;
    return {
      user: sanitizedUser,
      token,
    };
  }

  /**
   * Retrieves profile of current user.
   */
  public async getUserProfile(userId: string): Promise<SanitizedUser> {
    const user = await authRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundError(ErrorMessages.NOT_FOUND);
    }

    const { password: _, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}

export const authService = new AuthService();
export default authService;
