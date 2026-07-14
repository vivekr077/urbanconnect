import { z } from 'zod';
import { Gender } from '../../generated/prisma/client.js';

export const RegisterSchema = z.object({
  body: z.object({
    email: z.string().trim().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    name: z.string().trim().min(2, 'Name must be at least 2 characters long'),
    homeCity: z.string().trim().min(1, 'Home city is required'),
    homeCountry: z.string().trim().min(1, 'Home country is required'),
    homeState: z.string().trim().optional(),
    phoneNumber: z.string().trim().optional(),
    bio: z.string().trim().optional(),
    profileImageUrl: z.string().url('Invalid profile image URL').optional(),
    gender: z.nativeEnum(Gender).optional(),
    dateOfBirth: z.preprocess((val) => {
      if (typeof val === 'string' && val.trim() !== '') {
        return new Date(val);
      }
      return val;
    }, z.date().optional()),
  }),
});

export const LoginSchema = z.object({
  body: z.object({
    email: z.string().trim().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
