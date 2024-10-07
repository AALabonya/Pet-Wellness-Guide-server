import { Types } from 'mongoose';

type TPostCategory = 'Tip' | 'Story';

export type TPost = {
  _id: string;
  title: string;
  thumbnail: string [];
  category: TPostCategory;
  content: string;
  userId: Types.ObjectId;
  likes?: number;
  isPremium?: boolean;
};
