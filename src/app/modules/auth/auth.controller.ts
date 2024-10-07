import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthService } from './auth.service';
import config from '../../config';

const signupUser = catchAsync(async (req, res) => {


  // Pass files and req.body (the payload)
  const result = await AuthService.signupUser(req.file, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'User registered successfully',
    data: result,
  });
});


// login user controller
const loginUser = catchAsync(async (req, res) => {
  const result = await AuthService.loginUser(req.body);

  const { accessToken, refreshToken, data } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
    sameSite: true,
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User logged in successfully',
    token: {
      accessToken,
      refreshToken,
    },
    data,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthService.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token is retrieved successfully!',
    data: result,
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  await AuthService.forgetPassword(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reset password link sent to your email!',
    data: null,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const { email, newPassword, token } = req.body;

  await AuthService.resetPassword({ email, newPassword }, token);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password reset successfully!',
    data: null,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { email } = req.user;

  await AuthService.changePassword({ oldPassword, newPassword }, email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password changed successfully!',
    data: null,
  });
});

export const AuthController = {
  signupUser,
  loginUser,
  refreshToken,
  forgetPassword,
  resetPassword,
  changePassword,
};
