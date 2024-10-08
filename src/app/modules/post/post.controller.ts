import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PostServices } from './post.service';

const createPost = catchAsync(async (req, res) => {
  const {user}= req.user

  const result = await PostServices.createPostIntoDB(req.files as any[],user, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Post created successfully',
    data: result,
  });
});

const getMyPosts = catchAsync(async (req, res) => {
  const result = await PostServices.getMyPostsFromDB(req.user);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'My posts fetched successfully',
    data: result,
  });
});

const getPosts = catchAsync(async (req, res) => {
  const result = await PostServices.getPostsFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Posts fetched successfully',
    data: result,
  });
});

const getSinglePost = catchAsync(async (req, res) => {
  const result = await PostServices.getSinglePostFromDB(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Post fetched successfully',
    data: result,
  });
});

const updatePost = catchAsync(async (req, res) => {
  const result = await PostServices.updatePostIntoDB(req.body, req.params.id,req.files as any[]);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Post updated successfully',
    data: result,
  });
});

const deletePost = catchAsync(async (req, res) => {
  const result = await PostServices.deletePostFromDB(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Post deleted successfully',
    data: result,
  });
});

export const PostController = {
  createPost,
  getPosts,
  getSinglePost,
  updatePost,
  deletePost,
  getMyPosts
};