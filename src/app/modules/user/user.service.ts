// import httpStatus from 'http-status';
// import AppError from '../../errors/AppError';
// import { User } from './user.model';
// import { TUser } from './user.interface';
// import { JwtPayload } from 'jsonwebtoken';
// import QueryBuilder from '../../builder/QueryBuilder';
// import { imageToCloudinary } from '../../utils/imageToCloudinary';

// // get profile user
// const getUserProfileFromDB = async (loggedUser: JwtPayload) => {
//   // check user exist
//   const user = await User.isUserExistsByEmail(loggedUser?.email);

//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, 'User not found');
//   }

//   const result = await User.findById(user?._id);

//   return result;
// };

// const getAllUsersFromDB = async (query: Record<string, unknown>) => {
//   const userQuery = new QueryBuilder(User.find(), query)
//     .search(['name'])
//     .filter()
//     .fields()
//     .paginate()
//     .sort();
//   const result = await userQuery.modelQuery;
//   const meta = await userQuery.countTotal();

//   return {
//     meta,
//     result,
//   };
// };

// // get profile user
// // const updateUserIntoDB = async (
// //   payload: Partial<TUser>,
// //   loggedUser: JwtPayload,
// // ) => {
// //   // check user exist
// //   const user = await User.isUserExistsByEmail(loggedUser?.email);

// //   if (!user) {
// //     throw new AppError(httpStatus.NOT_FOUND, 'User not found');
// //   }

// //   const result = await User.findOneAndUpdate(
// //     { email: loggedUser?.email },
// //     {
// //       $set: payload,
// //     },
// //     { new: true },
// //   );

// //   return result;
// // };
// const updateUserIntoDB = async (
//   payload: Partial<TUser>,
//   loggedUser: JwtPayload,
//   file: any, // Add file as an optional parameter
// ) => {
//   // Check if the user exists
//   const user = await User.isUserExistsByEmail(loggedUser?.email);

//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, 'User not found');
//   }
//   if (file) {
//     const imageName = `profile_${Math.random().toString().split('.')[1]}`;
//     const path = file?.path;

//     //send image to cloudinary
//     const { secure_url } = await imageToCloudinary(imageName, path);
//     console.log(secure_url);
    
//     payload.profilePicture = secure_url as string;
// }

//   // Add profile image URL to payload if it exists
 

//   // Update the user with the new data, including the new profile picture URL if uploaded
//   const result = await User.findOneAndUpdate(
//     { email: loggedUser?.email },
//     {
//       $set: payload,
//     },
//     { new: true } // Return the updated user document
//   );

//   return result;
// };

// const deleteUserFromDB = async (id: string) => {
//   const findUser = await User.findById(id);

//   if (!findUser) {
//     throw new AppError(httpStatus.NOT_FOUND, 'User not found');
//   }

//   const result = await User.findByIdAndUpdate(id, {
//     isDeleted: true,
//   });

//   return result;
// };

// const updateRoleFromDB = async (id: string, role: string) => {
//   const findUser = await User.findById(id);

//   if (!findUser) {
//     throw new AppError(httpStatus.NOT_FOUND, 'User not found');
//   }

//   const result = await User.findByIdAndUpdate(id, { role });

//   return result;
// };

// export const UserServices = {
//   getUserProfileFromDB,
//   updateUserIntoDB,
//   getAllUsersFromDB,
//   deleteUserFromDB,
//   updateRoleFromDB,
// };

import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from './user.model';
import { TUser } from './user.interface';
import { JwtPayload } from 'jsonwebtoken';
import QueryBuilder from '../../builder/QueryBuilder';
import { imageToCloudinary } from '../../utils/imageToCloudinary';

// get profile user
const getUserProfileFromDB = async (loggedUser: JwtPayload) => {
  // check user exist
  const user = await User.isUserExistsByEmail(loggedUser?.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const result = await User.findById(user?._id);

  return result;
};

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(User.find(), query)
    .search(['name'])
    .filter()
    .fields()
    .paginate()
    .sort();
  const result = await userQuery.modelQuery;
  const meta = await userQuery.countTotal();

  return {
    meta,
    result,
  };
};

// // get profile user
// const updateUserIntoDB = async (
//   payload: Partial<TUser>,file:any,
//   loggedUser: JwtPayload,
// ) => {
//   // check user exist
//   const user = await User.isUserExistsByEmail(loggedUser?.email);
// console.log(user.email,"user");

//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, 'User not found');
//   }
//   if (file) {
//     const imageName = `profile_${Math.random().toString().split('.')[1]}`;
//     const path = file?.path;

//     //send image to cloudinary
//     const { secure_url } = await imageToCloudinary(imageName, path);
//     payload.profilePicture = secure_url as string;
// }

//   // Add profile image URL to payload if it exists
 
// console.log(payload,"payload");

//   const result = await User.findOneAndUpdate(
//     { email: user?.email },
//     {
//       $set: payload,
//     },
//     { new: true, runValidators: true },
//   );
// console.log(result,"ressssssssssssult");

//   return result;
// };
const updateUserIntoDB = async (
  payload: Partial<TUser>, 
  file: any, 
  loggedUser: JwtPayload
) => {
  // Check if the user exists in the database
  const user = await User.isUserExistsByEmail(loggedUser?.email);
  

  // If user doesn't exist, throw an error
  if (!user || !user.email) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found or email is missing');
  }

  // If a file is uploaded, handle the file upload
  if (file) {
    // const imageName = `profile_${Math.random().toString().split('.')[1]}`;
    const path = file?.path;

    // Upload the image to Cloudinary and set the profile picture URL in the payload
    // const { secure_url } = await imageToCloudinary(imageName, path);
    payload.profilePicture = path as string;
  }

  console.log(payload, "Payload before update"); // Log payload to confirm correct data

  // Perform the update operation
  const result = await User.findOneAndUpdate(
    { email: user?.email }, // Make sure this email matches the intended user
    {
      $set: payload, // Set the new data
    },
    { new: true, runValidators: true } // Return the updated document and run schema validators
  );


  return result;
};

const deleteUserFromDB = async (id: string) => {
  const findUser = await User.findById(id);

  if (!findUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const result = await User.findByIdAndUpdate(id, {
    isDeleted: true,
  });

  return result;
};

const updateRoleFromDB = async (id: string, role: string) => {
  const findUser = await User.findById(id);

  if (!findUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const result = await User.findByIdAndUpdate(id, { role });

  return result;
};

export const UserServices = {
  getUserProfileFromDB,
  updateUserIntoDB,
  getAllUsersFromDB,
  deleteUserFromDB,
  updateRoleFromDB,
};