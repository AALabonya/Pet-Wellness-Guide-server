import { Types } from 'mongoose';

export type TFollowers = {
  userId: Types.ObjectId;
  followerId: Types.ObjectId;
};
