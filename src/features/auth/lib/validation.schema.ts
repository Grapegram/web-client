import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';

export const signupValidationSchema = toTypedSchema(
  z.object({
    username: z
      .string()
      .min(2, { message: 'Username must be at least 2 characters.' })
      .max(20, { message: 'Username must be at most 20 characters.' }),
    email: z.string().email({ message: 'Incorrect email syntax.' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters.' })
      .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter.'
      })
      .regex(/[a-z]/, {
        message: 'Password must contain at least one lowercase letter.'
      })
      .regex(/[0-9]/, {
        message: 'Password must contain at least one number.'
      })
      .regex(/[^a-zA-Z0-9]/, {
        message: 'Password must contain at least one special character.'
      })
  })
);

export const loginValidationSchema = toTypedSchema(
  z.object({
    credential: z
      .string()
      .min(1, 'Required')
      .refine(
        val => {
          if (val.includes('@')) {
            return z.string().email().safeParse(val).success;
          }
          return true;
        },
        { message: 'Invalid email format.' }
      ),
    password: z.string()
  })
);
