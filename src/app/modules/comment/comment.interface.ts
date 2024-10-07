import { Types } from 'mongoose';

export type TPostComment = {
  _id: string;
  postId: Types.ObjectId;
  userId: Types.ObjectId;
  comment: string;
};