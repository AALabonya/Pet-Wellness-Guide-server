import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { paymentRoutes } from '../modules/payment/payment.route';
import { FollowersRoutes } from '../modules/followers/followers.route';
import { PostRoutes } from '../modules/post/post.route';
import { CommentRoutes } from '../modules/comment/comment.route';
import { VoteRoutes } from '../modules/vote/vote.route';

const router = Router();

// parent route assign
const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/payments',
    route: paymentRoutes,
  },
  {
    path: '/followers',
    route: FollowersRoutes,
  },
  {
    path: '/posts',
    route: PostRoutes,
  },
  {
    path: '/comments',
    route: CommentRoutes,
  },
  {
    path: '/votes',
    route: VoteRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;