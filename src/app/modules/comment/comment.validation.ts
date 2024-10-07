import { z } from 'zod';

const createCommentValidationSchema = z.object({
  body: z.object({
    comment: z.string({ required_error: 'Comment is required' }),
    userId: z.string({ required_error: 'User ID is required' }),
    postId: z.string({ required_error: 'Post ID is required' }),
  }),
});

const updateCommentValidationSchema = z.object({
  body: z.object({
    comment: z.string().optional(),
    userId: z.string().optional(),
    postId: z.string().optional(),
  }),
});

export const CommentValidation = {
  createCommentValidationSchema,
  updateCommentValidationSchema,
};