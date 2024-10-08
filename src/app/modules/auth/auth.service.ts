import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TUser } from '../user/user.interface';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import config from '../../config';
import { generateToken, verifyToken } from './auth.utils';
import { sendEmail } from '../../utils/sendEmail';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { imageToCloudinary } from '../../utils/imageToCloudinary';

// sign up user

const signupUser = async (file: any, payload: TUser) => {
  // Check if user already exists by email
  if (await User.isUserExistsByEmail(payload.email)) {
    throw new AppError(
      httpStatus.CONFLICT,
      'This email is already in use by another user.',
    );
  }

  
  if (file) {
    const imageName = `profile_${Math.random().toString().split('.')[1]}`;
    const path = file?.path;

    //send image to cloudinary
    const { secure_url } = await imageToCloudinary(imageName, path);
    payload.profilePicture = secure_url as string;
}

  // Add profile image URL to payload if it exists
 

  // Create the user
  const result = await User.create(payload);

  return result;
};
// login user service
const loginUser = async (payload: TLoginUser) => {
  // check user are exist
  const user = await User.isUserExistsByEmail(payload.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password not matched');
  }

  const jwtPayload = {
    email: user.email,
    id: user._id,
    role: user.role,
    name: user.name,
    profilePicture: user.profilePicture,
    phone: user.phone,
    premiumMember: user.premiumMember,
  };

  // generate token
  const accessToken = generateToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = generateToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    data: user,
  };
};

const refreshToken = async (token: string) => {
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { userEmail } = decoded;

  const user = await User.isUserExistsByEmail(userEmail);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  const jwtPayload = {
    email: user.email,
    id: user._id,
    role: user.role,
    name: user.name,
    profilePicture: user.profilePicture,
    phone: user.phone,
  };

  const accessToken = generateToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

// const forgetPassword = async (email: string) => {
//   const isExistUser = await User.isUserExistsByEmail(email);

//   if (!isExistUser) {
//     throw new AppError(httpStatus.NOT_FOUND, 'User not found');
//   }

//   if (await User.isUserDeleted(email)) {
//     throw new AppError(httpStatus.FORBIDDEN, 'User Already Deleted');
//   }

//   if (await User.isUserStatus(email)) {
//     throw new AppError(httpStatus.FORBIDDEN, 'User Blocked');
//   }

//   const jwtPayload = {
//     email: isExistUser.email,
//     role: isExistUser.role,
//   };

//   const resetToken = generateToken(
//     jwtPayload,
//     config.jwt_access_secret as string,
//     '1h',
//   );

//   const resetURLLink = `${config.client_url}/reset?email=${isExistUser.email}&token=${resetToken}`;

//   sendEmail(resetURLLink, email);
// };
const forgetPassword = async (email: string) => {
  const isExistUser = await User.isUserExistsByEmail(email);


  if (!isExistUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  } 

  if (await User.isUserDeleted(email)) {
    throw new AppError(httpStatus.FORBIDDEN, 'User Already Deleted');
  }

  if (await User.isUserStatus(email)) {
    throw new AppError(httpStatus.FORBIDDEN, 'User Blocked');
  }

  const jwtPayload = {
    email: isExistUser.email,
    role: isExistUser.role,
  };

  const resetToken = generateToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '1h',
  );

  const resetURLLink = `${config.client_url}/reset?email=${isExistUser.email}&token=${resetToken}`;

  sendEmail(resetURLLink, email);
};
const resetPassword = async (
  payload: { email: string; newPassword: string },
  token: string,
) => {
  const isExistUser = await User.findOne({ email: payload.email });

  if (!isExistUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (await User.isUserDeleted(payload.email)) {
    throw new AppError(httpStatus.FORBIDDEN, 'User Already Deleted');
  }

  if (await User.isUserStatus(payload.email)) {
    throw new AppError(httpStatus.FORBIDDEN, 'User Blocked');
  }

  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;

  if (decoded.email !== payload.email) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized');
  }

  const newHashPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      email: decoded.email,
      role: decoded.role,
    },
    {
      password: newHashPassword,
      passwordChangedAt: new Date(),
    },
  );
};
const changePassword = async (
  payload: { oldPassword: string; newPassword: string },
  email: string,
) => {
  const isExistUser = await User.isUserExistsByEmail(email);

  if (!isExistUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (await User.isUserDeleted(email)) {
    throw new AppError(httpStatus.FORBIDDEN, 'User Already Deleted');
  }

  if (await User.isUserStatus(email)) {
    throw new AppError(httpStatus.FORBIDDEN, 'User Blocked');
  }

  if (
    !(await User.isPasswordMatched(payload?.oldPassword, isExistUser?.password))
  ) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password not matched');
  }

  const newHashPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    { email: isExistUser.email, role: isExistUser.role },
    { password: newHashPassword, passwordChangedAt: new Date() },
  );
};

export const AuthService = {
  signupUser,
  loginUser,
  refreshToken,
  forgetPassword,
  resetPassword,
  changePassword,
};
