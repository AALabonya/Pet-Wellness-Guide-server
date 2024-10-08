// import { NextFunction, Request, Response, Router } from 'express';
// import { UserController } from './user.controller';
// import auth from '../../middlewares/auth';
// import validateRequest from '../../middlewares/validateRequest';
// import { UserValidation } from './user.validation';
// import { upload } from '../../utils/imageToCloudinary';

// const router = Router();

// // assign user routes

// // get profile for user
// router.get('/me', auth('admin', 'user'), UserController.getUserProfile);
// router.get('/all', UserController.getAllUsers);

// // update profile for user
// router.put(
//   '/me', upload.single('profilePicture'),
//   (req: Request, res: Response, next: NextFunction) => {
//     // console.log(req.body.data);
    
//       req.body = req.body.data;
//       next();
//   },
//   auth('admin', 'user'),
//   validateRequest(UserValidation.updateUserValidationSchema),
//   UserController.updateUserProfile,
// );

// router.put(
//   '/role/:id',
//   auth('admin'),
//   validateRequest(UserValidation.updateRoleValidationSchema),
//   UserController.updateRole,
// );

// router.delete('/:id', auth('admin'), UserController.deleteUsers);

// export const UserRoutes = router;

import { NextFunction, Request, Response, Router } from 'express'
import { UserController } from './user.controller';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';
import { upload } from '../../utils/imageToCloudinary';

const router = Router();

// assign user routes

// get profile for user
router.get('/me', auth('admin', 'user'), UserController.getUserProfile);
router.get('/all', UserController.getAllUsers);

// update profile for user
router.put(
  '/me',upload.single('profilePicture'),
    (req: Request, res: Response, next: NextFunction) => {
      // console.log(req.body.data);
      
        req.body =JSON.parse(req.body.data);
        next();
    },
  auth('admin', 'user'),
  validateRequest(UserValidation.updateUserValidationSchema),
  UserController.updateUserProfile,
);

router.put(
  '/role/:id',
  auth('admin'),
  validateRequest(UserValidation.updateRoleValidationSchema),
  UserController.updateRole,
);

router.delete('/:id', auth('admin'), UserController.deleteUsers);

export const UserRoutes = router;