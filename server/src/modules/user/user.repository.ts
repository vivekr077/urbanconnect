import prisma from '../../lib/prisma.js';
import type { UpdateProfileInput, SportInput } from './user.types.js';

export class UserRepository {
  /**
   * Finds a user by ID, including their sports list and excluding their password.
   * @param userId User UUID
   */
  public async findUserById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        profileImageUrl: true,
        bio: true,
        gender: true,
        dateOfBirth: true,
        homeCity: true,
        homeState: true,
        homeCountry: true,
        trustScore: true,
        isVerified: true,
        accountStatus: true,
        deletedAt: true,
        createdAt: true,
        updatedAt: true,
        sports: {
          select: {
            id: true,
            activityType: true,
            skillLevel: true,
            createdAt: true,
          },
        },
      },
    });
  }

  /**
   * Performs standard column updates on the User.
   * @param userId User UUID
   * @param data User profile update data
   */
  public async updateUser(userId: string, data: UpdateProfileInput) {
    return prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        profileImageUrl: true,
        bio: true,
        gender: true,
        dateOfBirth: true,
        homeCity: true,
        homeState: true,
        homeCountry: true,
        trustScore: true,
        isVerified: true,
        accountStatus: true,
        deletedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Performs a raw PostGIS SQL query to set the geography point column.
   * @param userId User UUID
   * @param latitude Latitude
   * @param longitude Longitude
   */
  public async updateLocation(userId: string, latitude: number, longitude: number): Promise<void> {
    await prisma.$executeRaw`
      UPDATE "User"
      SET "currentLocation" = ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography
      WHERE id = ${userId}::uuid
    `;
  }

  /**
   * Performs a raw PostGIS SQL query to retrieve coordinate points.
   * @param userId User UUID
   */
  public async getUserLocation(userId: string): Promise<{ latitude: number; longitude: number } | null> {
    const result = await prisma.$queryRaw<{ latitude: number; longitude: number }[]>`
      SELECT ST_Y("currentLocation"::geometry) as latitude, ST_X("currentLocation"::geometry) as longitude
      FROM "User"
      WHERE id = ${userId}::uuid
    `;
    return result[0] || null;
  }

  /**
   * Performs a transaction to delete previous sports and batch-insert new ones.
   * @param userId User UUID
   * @param sports Array of sport details to insert
   */
  public async updateUserSports(userId: string, sports: SportInput[]): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // Delete existing sports
      await tx.userSport.deleteMany({
        where: { userId },
      });

      // Insert new sports if list is not empty
      if (sports.length > 0) {
        await tx.userSport.createMany({
          data: sports.map((s) => ({
            userId,
            activityType: s.activityType,
            skillLevel: s.skillLevel,
          })),
        });
      }
    });
  }
}

export const userRepository = new UserRepository();
export default userRepository;
