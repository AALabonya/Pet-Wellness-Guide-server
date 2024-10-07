import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TVote } from './vote.interface';
import { Vote } from './vote.modal';
import { Post } from '../post/post.modal';

const upVoteIntoDB = async (payload: TVote) => {
  const isVotedPost = await Vote.findOne({
    postId: payload.postId,
    userId: payload.userId,
  });

  const findPost = await Post.findById(payload.postId);

  if (!findPost) {
    throw new AppError(httpStatus.OK, 'Post not found');
  }

  if (isVotedPost) {
    if (isVotedPost.type === 'upvote') {
      throw new AppError(httpStatus.OK, 'You have already upvoted');
    } else {
      await Vote.findOneAndDelete({
        postId: payload.postId,
        userId: payload.userId,
      });

      await Post.findByIdAndUpdate(payload.postId, { $inc: { likes: 1 } });
      await new Vote({ ...payload, type: 'upvote' }).save();
    }
  } else {
    await new Vote({ ...payload, type: 'upvote' }).save();
    await Post.findByIdAndUpdate(payload.postId, { $inc: { likes: 1 } });
  }

  return { message: 'Upvoted successfully' };
};

const downVoteIntoDB = async (payload: TVote) => {
  const isVotedPost = await Vote.findOne({
    postId: payload.postId,
    userId: payload.userId,
  });

  const findPost = await Post.findById(payload.postId);

  if (!findPost) {
    throw new AppError(httpStatus.OK, 'Post not found');
  }

  if (isVotedPost) {
    if (isVotedPost.type === 'downvote') {
      throw new AppError(httpStatus.OK, 'You have already downvoted');
    } else {
      await Vote.findOneAndDelete({
        postId: payload.postId,
        userId: payload.userId,
      });

      await Post.findByIdAndUpdate(payload.postId, { $inc: { likes: -1 } });
      await new Vote({ ...payload, type: 'downvote' }).save();
    }
  } else {
    await new Vote({ ...payload, type: 'downvote' }).save();
    await Post.findByIdAndUpdate(payload.postId, { $inc: { likes: -1 } });
  }

  return { message: 'Downvoted successfully' };
};

export const VoteServices = {
  upVoteIntoDB,
  downVoteIntoDB,
};