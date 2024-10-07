import { model, Schema } from 'mongoose';
import { TFollowers } from './followers.interface';

const followersModal = new Schema<TFollowers>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    followerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true },
);

export const Followers = model<TFollowers>('Followers', followersModal);
