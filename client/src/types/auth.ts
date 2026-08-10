import { User } from './user';

export interface AuthSuccessPayload {
  user: User;
  token: string;
}
