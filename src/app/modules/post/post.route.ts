import { NextFunction, Request, Response, Router } from 'express';
import auth from '../../middlewares/auth';
import { PostController } from './post.controller';
import validateRequest from '../../middlewares/validateRequest';
import { PostValidation } from './post.validation';
import { upload } from '../../utils/imageToCloudinary';

const router = Router();

router.post(
  '/',  upload.array('images', 10),
  (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  auth('admin', 'user'),
  validateRequest(PostValidation.createPostValidationSchema),
  PostController.createPost,
);

router.get('/me', auth('admin', 'user'), PostController.getMyPosts);

router.get('/', PostController.getPosts);

router.get('/:id', PostController.getSinglePost);

router.put(
  '/:id', upload.array('images', 10),
  (req: Request, res: Response, next: NextFunction) => {
    // console.log(req.body.data);
    
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  auth('admin', 'user'),
  validateRequest(PostValidation.updatePostValidationSchema),
  PostController.updatePost,
);

router.delete('/:id', auth('admin', 'user'), PostController.deletePost);

export const PostRoutes = router;