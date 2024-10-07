import { USER_ROLE } from '../user/user.constant';
import { TRole } from '../user/user.interface';

// login user type
export type TLoginUser = {
  email: string;
  password: string;
};

// generate token types
export type TGenerateToken = {
  email: string;
  role: TRole | undefined;
  id?: string | undefined;
  name?: string;
  profilePicture?:string;
  phone?: string;
};

// logged in user types
export type TLoggedUser = {
  email: string;
  role: string;
  id: string;
  iat: number;
  exp: number;
};
// 
// auth interface
export type TUserRole = keyof typeof USER_ROLE;
