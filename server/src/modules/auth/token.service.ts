import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';

export interface TokenPayload {
  id: string;
  email: string;
}

export class TokenService {
  /**
   * Generates a JWT access token.
   * @param payload User data to sign into the token
   */
  public generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRATION as any,
    });
  }

  /**
   * Verifies a JWT access token and returns its decoded payload.
   * @param token JWT token string
   */
  public verifyToken(token: string): TokenPayload {
    return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
  }

  /**
   * Decodes a JWT token without verifying the signature.
   * @param token JWT token string
   */
  public decodeToken(token: string): TokenPayload | null {
    return jwt.decode(token) as TokenPayload | null;
  }
}

export const tokenService = new TokenService();
export default tokenService;
