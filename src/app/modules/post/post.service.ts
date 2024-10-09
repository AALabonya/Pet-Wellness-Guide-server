import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { TPost } from './post.interface';
import { Post } from './post.modal';
import { JwtPayload } from 'jsonwebtoken';
import { Comment } from '../comment/comment.model';


const createPostIntoDB = async (files: any[], user: any,payload: TPost) => {
  // console.log(payload ,"pppppppppppppppppppppppp");
  
  const imageUrls: string[] = [];
  
  if (files && files.length > 0) {
    for (const file of files) {
      // const imageName = `images_${Math.random().toString().split('.')[1]}`;
      const path = file.path;

      // const { secure_url } = await imageToCloudinary(imageName, path);

      
      imageUrls.push(path as string);
    }
  }

  payload.thumbnail = imageUrls;
  // payload.userId = user;

  const post = await Post.create(payload);
  // Create the post in the database
// console.log(post);

  return post; // Return the created post
};



const getMyPostsFromDB = async (loggedUser: JwtPayload) => {
  const posts = await Post.find({ userId: loggedUser.id }).populate('userId');

  return posts;
};

const getPostsFromDB = async (query: Record<string, unknown>) => {
  const postQuery = new QueryBuilder(Post.find().populate('userId'), query)
    .search(['title', 'content'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const posts = await postQuery.modelQuery.lean();
  const meta = await postQuery.countTotal();

  const postIds = posts.map((post) => post._id);
  const comments = await Comment.find({ postId: { $in: postIds } }).populate("userId");

  const postsWithComments = posts.map((post) => ({
    ...post,
    comments: comments.filter((comment) => comment.postId.equals(post._id as string)),
  }));

  return {
    meta,
    result: postsWithComments,
  };
};


const getSinglePostFromDB = async (id: string) => {
  const findPost = await Post.findById(id).populate('userId');

  if (!findPost) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  const comments = await Comment.find({ postId: id }).populate('userId');

  const postWithComments = {
    ...findPost.toObject(),
    comments,
  };

  return postWithComments;
};

const updatePostIntoDB = async (payload: Partial<TPost>, id: string,files: any[]) => {
  const imageUrls: string[] = [];
  // console.log(files,"file");
  
  if (files && files.length > 0) {
    for (const file of files) {
      // const imageName = `images_${Math.random().toString().split('.')[1]}`;
      const path = file.path;

      // const { secure_url } = await imageToCloudinary(imageName, path);

      
      imageUrls.push(path as string);
    }
  }

  payload.thumbnail = imageUrls;
  const result = await Post.findByIdAndUpdate(id, payload, { new: true });


  return result;
};

const deletePostFromDB = async (id: string) => {
  const result = await Post.findByIdAndDelete(id);

  return result;
};

export const PostServices = {
  createPostIntoDB,
  getPostsFromDB,
  getSinglePostFromDB,
  updatePostIntoDB,
  deletePostFromDB,
  getMyPostsFromDB,
};
