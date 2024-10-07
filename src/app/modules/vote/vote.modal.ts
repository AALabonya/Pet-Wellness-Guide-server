import { model, Schema } from 'mongoose';
import { TVote } from './vote.interface';

const voteSchema = new Schema<TVote>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['upvote', 'downvote'],
      required: true,
    },
  },
  { timestamps: true },
);

export const Vote = model<TVote>('Vote', voteSchema);