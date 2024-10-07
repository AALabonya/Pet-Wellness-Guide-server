import { z } from 'zod';

const createPostValidationSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
    category: z.enum(['Tip', 'Story'], { required_error: 'Category is required' }), // Optional: specify error message
    content: z.string({ required_error: 'Content is required' }),
    userId: z.string({ required_error: 'User ID is required' }),
    isPremium: z.boolean().optional(),
  }),
});

const updatePostValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    category: z.enum(['Tip', 'Story']).optional(),
    content: z.string().optional(),
    likes: z.number().optional(),
    userId: z.string().optional(),
    isPremium: z.boolean().optional(),
  }),
});

export const PostValidation = {
  createPostValidationSchema,
  updatePostValidationSchema,
};
