import { Router } from 'express';
import auth from '../../middlewares/auth';
import { VoteController } from './vote.controller';
import validateRequest from '../../middlewares/validateRequest';
import { VoteValidation } from './vote.validation';

const router = Router();

router.post(
  '/upvote',
  auth('admin', 'user'),
  validateRequest(VoteValidation.voteValidationSchema),
  VoteController.upVoted,
);
router.post(
  '/downvote',
  auth('admin', 'user'),
  validateRequest(VoteValidation.voteValidationSchema),
  VoteController.downVoted,
);

export const VoteRoutes = router;