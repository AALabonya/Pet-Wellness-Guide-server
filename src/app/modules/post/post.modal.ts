import { model, Schema } from 'mongoose';
import { TPost } from './post.interface';

const postSchema = new Schema<TPost>(
  {
    title: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: [String],
      required: true,
    },
    category: {
      type: String,
      enum: ['Tip', 'Story'],
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Post = model<TPost>('Post', postSchema);
