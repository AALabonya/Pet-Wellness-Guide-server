import { model, Schema } from 'mongoose';
import { TPostComment } from './comment.interface';

const commentSchema = new Schema<TPostComment>(
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
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Comment = model<TPostComment>('Comment', commentSchema);