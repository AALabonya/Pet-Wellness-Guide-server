import { Model } from 'mongoose';

// user role type
export type TRole = 'admin' | 'user';

// user type
export type TUser = {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  profilePicture?: string;
  passwordChangedAt: Date;
  _id?: string;
  bio: string;
  gender?: string;
  premiumMember?: boolean;
  transactionId?: string;
  status?: 'in-progress' | 'blocked';
  isDeleted: boolean;
  role?: TRole;
};

// make the statics method interface for user validation
export interface UserModel extends Model<TUser> {
  // check user exists using email interface
  isUserExistsByEmail(email: string): Promise<TUser>;

  // password check interface
  isPasswordMatched(
    plainTextPassword: string,
    hashPassword: string,
  ): Promise<boolean>;

  isUserDeleted(email: string): boolean;
  isUserStatus(email: string): boolean;
}