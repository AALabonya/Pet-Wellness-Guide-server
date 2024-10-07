import { Types } from 'mongoose';

export type TVote = {
  _id: string;
  postId: Types.ObjectId;
  userId: Types.ObjectId;
  type: 'upvote' | 'downvote';
};
