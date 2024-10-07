import { z } from 'zod';



// Create user validation using Zod
const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    email: z.string({ required_error: 'Email is required' }).email(),
    password: z
      .string({ required_error: 'Password is required' })
      .min(2, { message: 'Password need more than 2 characters' })
      .max(20, 'Password need less than 20 characters'),
    phone: z.string({ required_error: 'Phone number is required' }),
    address: z.string({ required_error: 'Address is required' }),
    gender: z.string().optional(),
    role: z.enum(['admin', 'user']).optional(),
  }),
});


// update user validation using zod
const updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).optional(),
    email: z.string({ required_error: 'Email is required' }).email().optional(),
    password: z
      .string({ required_error: 'Password is required' })
      .min(2, { message: 'Password need more than 2 characters' })
      .max(20, 'Password need less than 20 characters')
      .optional(),
    phone: z.string({ required_error: 'Phone number is required' }).optional(),
    address: z.string({ required_error: 'Address is required' }).optional(),
    bio: z.string().optional(),
    gender: z.string().optional(),
    transactionId: z.string().optional(),
    isDeleted: z.boolean().optional(),
    premiumMember: z.boolean().optional(),
    passwordChangedAt: z.date().optional(),
    status: z.enum(['in-progress', 'blocked']).optional(),
    role: z.string({ required_error: 'Role is required' }).optional(),
  }),
});

// login user validation using zod
const loginUserValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }),
    password: z.string({ required_error: 'Password is Required' }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required!',
    }),
  }),
});

const updateRoleValidationSchema = z.object({
  body: z.object({
    role: z.string({ required_error: 'Role is Required' }),
  }),
});

export const UserValidation = {
  createUserValidationSchema,
  updateUserValidationSchema,
  loginUserValidationSchema,
  refreshTokenValidationSchema,
  updateRoleValidationSchema,
};
