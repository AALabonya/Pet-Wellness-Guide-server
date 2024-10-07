import { NextFunction, Request, Response, Router } from 'express';

import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from '../user/user.validation';
import { AuthController } from './auth.controller';
import auth from '../../middlewares/auth';
import { upload } from '../../utils/imageToCloudinary';

const router = Router();

// assign auth routes
// signup user
router.post(
  '/signup',
  upload.single('profilePicture'),
    (req: Request, res: Response, next: NextFunction) => {
      console.log(req.body.data);
      
        req.body = JSON.parse(req.body.data);
        next();
    },
  validateRequest(UserValidation.createUserValidationSchema), 
  AuthController.signupUser // Call the signup user controller
);

// login user
router.post(
  '/login',
  validateRequest(UserValidation.loginUserValidationSchema),
  AuthController.loginUser,
);

router.post(
  '/refresh-token',
  validateRequest(UserValidation.refreshTokenValidationSchema),
  AuthController.refreshToken,
);

router.post('/forget-password', AuthController.forgetPassword);

router.post('/reset-password', AuthController.resetPassword);

router.post(
  '/change-password',
  auth('admin', 'user'),
  AuthController.changePassword,
);

export const AuthRoutes = router;
