import { JwtPayload } from 'jsonwebtoken';
import { TPostComment } from './comment.interface';
import { Comment } from './comment.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createComment = async (payload: TPostComment) => {
  const result = await Comment.create(payload);

  return result;
};

const getCommentsByPostId = async (postId: string) => {
  const result = await Comment.find({ postId }).populate('userId');

  return result;
};

const updateComment = async (
  payload: Partial<TPostComment>,
  id: string,
  loggedUser: JwtPayload,
) => {
  const isCommentUserExist = await Comment.findOne({
    userId: loggedUser.id,
    _id: id,
  });

  if (!isCommentUserExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'You are not the owner of this comment',
    );
  }

  const result = await Comment.findOneAndUpdate(
    {
      _id: id,
      userId: loggedUser.id,
    },
    { $set: {
      comment: payload.comment,
    } },
    { new: true },
  );


  return result;
};

const deleteComment = async (id: string, loggedUser: JwtPayload) => {
  const result = await Comment.findOneAndDelete({
    _id: id,
    userId: loggedUser.id,
  });

  return result;
};

export const CommentServices = {
  createComment,
  getCommentsByPostId,
  updateComment,
  deleteComment,
};