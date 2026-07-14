import type { User } from '../../generated/prisma/client.js';

export type SanitizedUser = Omit<User, 'password'>;

export interface AuthSuccessPayload {
  user: SanitizedUser;
  token: string;
}
