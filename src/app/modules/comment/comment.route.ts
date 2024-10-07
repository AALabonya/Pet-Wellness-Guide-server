import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CommentValidation } from './comment.validation';
import { CommentController } from './comment.controller';

const router = Router();

router.post(
  '/',
  auth('admin', 'user'),
  validateRequest(CommentValidation.createCommentValidationSchema),
  CommentController.createComment,
);

router.get('/:postId', CommentController.getCommentsByPostId);

router.put(
  '/:id',
  auth('admin', 'user'),
  validateRequest(CommentValidation.updateCommentValidationSchema),
  CommentController.updateComment,
);

router.delete('/:id', auth('admin', 'user'), CommentController.deleteComment);

export const CommentRoutes = router;