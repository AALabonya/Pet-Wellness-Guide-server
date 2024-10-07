import { Schema, model } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import bcrypt from 'bcryptjs';
import config from '../../config';

// make user schema model using mongoose one more layer validation
const userSchema = new Schema<TUser, UserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
    profilePicture: {
      type: String,
    },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    passwordChangedAt: {
      type: Date,
    },
    premiumMember: {
      type: Boolean,
      default: false,
    },
    transactionId: {
      type: String,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  },
);

// secure password
userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );

  next();
});

// remove password form my response
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

// compare password static method
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashPassword,
) {
  return bcrypt.compare(plainTextPassword, hashPassword);
};

// check user exists provide user email then send true
userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email }).select('+password');
};

userSchema.statics.isUserDeleted = async function (email: string) {
  const user = await User.findOne({ email });

  if (user?.isDeleted === true) {
    return true;
  }
};

userSchema.statics.isUserStatus = async function (email: string) {
  const user = await User.findOne({ email });

  if (user?.status === 'blocked') {
    return true;
  }
};

export const User = model<TUser, UserModel>('User', userSchema);