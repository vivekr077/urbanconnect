import { cleanEnv, str, port } from 'envalid';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const env = cleanEnv(process.env, {
  PORT: port({ default: 3000 }),
  NODE_ENV: str({ choices: ['development', 'production', 'test'], default: 'development' }),
  DATABASE_URL: str(),
  JWT_SECRET: str(),
  JWT_ACCESS_EXPIRATION: str({ default: '15m' }),
});
