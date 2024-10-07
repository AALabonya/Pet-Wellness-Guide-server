import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CommentServices } from './comment.service';

const createComment = catchAsync(async (req, res) => {
  const result = await CommentServices.createComment(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Comment created successfully',
    data: result,
  });
});

const getCommentsByPostId = catchAsync(async (req, res) => {
  const result = await CommentServices.getCommentsByPostId(req.params.postId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Comments fetched successfully',
    data: result,
  });
});

const updateComment = catchAsync(async (req, res) => {
  const result = await CommentServices.updateComment(
    req.body,
    req.params.id,
    req.user,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Comment updated successfully',
    data: result,
  });
});

const deleteComment = catchAsync(async (req, res) => {
  const result = await CommentServices.deleteComment(req.params.id, req.user);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Comment deleted successfully',
    data: result,
  });
});

export const CommentController = {
  createComment,
  updateComment,
  deleteComment,
  getCommentsByPostId,
};