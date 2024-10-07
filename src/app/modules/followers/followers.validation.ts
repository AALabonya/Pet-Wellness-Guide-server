import { z } from 'zod';

const followersValidationSchema = z.object({
  body: z.object({
    userId: z.string({ required_error: 'userId is required' }),
    followerId: z.string({ required_error: 'followerId is required' }),
  }),
});

export const FollowersValidations = {
  followersValidationSchema,
};
