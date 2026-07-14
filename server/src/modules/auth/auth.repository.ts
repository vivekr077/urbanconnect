import prisma from '../../lib/prisma.js';
import { Prisma } from '../../generated/prisma/client.js';

export class AuthRepository {
  /**
   * Creates a new user record.
   * @param data User creation payload
   */
  public async createUser(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
    });
  }

  /**
   * Finds a user by email address.
   * @param email User email
   */
  public async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Finds a user by ID.
   * @param id User UUID
   */
  public async findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }
}

export const authRepository = new AuthRepository();
export default authRepository;
