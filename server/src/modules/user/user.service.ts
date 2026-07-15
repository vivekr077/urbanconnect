import { userRepository } from './user.repository.js';
import { NotFoundError, ForbiddenError } from '../../errors/customErrors.js';
import { ErrorMessages } from '../../constants/messages.js';
import { AccountStatus } from '../../generated/prisma/client.js';
import type { UpdateProfileInput, SportInput, UserProfileResponse, LocationInput } from './user.types.js';

export class UserService {
  /**
   * Updates standard profile columns and returns the full profile.
   * @param userId User UUID
   * @param data User profile details to update
   */
  public async updateProfile(userId: string, data: UpdateProfileInput): Promise<UserProfileResponse> {
    const user = await userRepository.findUserById(userId);
    if (!user || user.deletedAt !== null) {
      throw new NotFoundError(ErrorMessages.NOT_FOUND);
    }
    if (user.accountStatus !== AccountStatus.ACTIVE) {
      throw new ForbiddenError('Your account is currently ' + user.accountStatus);
    }

    await userRepository.updateUser(userId, data);
    return this.getProfile(userId);
  }

  /**
   * Retrieves profile details of any active user.
   * @param userId User UUID
   */
  public async getProfile(userId: string): Promise<UserProfileResponse> {
    const user = await userRepository.findUserById(userId);
    if (!user || user.deletedAt !== null) {
      throw new NotFoundError('User profile not found');
    }
    if (user.accountStatus !== AccountStatus.ACTIVE) {
      throw new ForbiddenError('This user profile is currently inactive.');
    }

    const location = await userRepository.getUserLocation(userId);

    const { deletedAt, accountStatus, ...sanitizedUser } = user;

    return {
      ...sanitizedUser,
      currentLocation: location,
    };
  }

  /**
   * Updates user PostGIS spatial coordinates.
   * @param userId User UUID
   * @param latitude Latitude
   * @param longitude Longitude
   */
  public async updateLocation(userId: string, latitude: number, longitude: number): Promise<LocationInput> {
    const user = await userRepository.findUserById(userId);
    if (!user || user.deletedAt !== null) {
      throw new NotFoundError(ErrorMessages.NOT_FOUND);
    }
    if (user.accountStatus !== AccountStatus.ACTIVE) {
      throw new ForbiddenError('Your account is currently ' + user.accountStatus);
    }

    await userRepository.updateLocation(userId, latitude, longitude);
    return { latitude, longitude };
  }

  /**
   * Updates user played sports configuration.
   * @param userId User UUID
   * @param sports Array of sport details to configure
   */
  public async updateSports(userId: string, sports: SportInput[]) {
    const user = await userRepository.findUserById(userId);
    if (!user || user.deletedAt !== null) {
      throw new NotFoundError(ErrorMessages.NOT_FOUND);
    }
    if (user.accountStatus !== AccountStatus.ACTIVE) {
      throw new ForbiddenError('Your account is currently ' + user.accountStatus);
    }

    await userRepository.updateUserSports(userId, sports);

    // Fetch and return the updated sports configuration
    const updatedUser = await userRepository.findUserById(userId);
    return updatedUser?.sports || [];
  }
}

export const userService = new UserService();
export default userService;
