import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { VoteServices } from './vote.service';

const upVoted = catchAsync(async (req, res) => {
  const result = await VoteServices.upVoteIntoDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Post upvoted successfully',
    data: result,
  });
});

const downVoted = catchAsync(async (req, res) => {
  const result = await VoteServices.downVoteIntoDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Post downvoted successfully',
    data: result,
  });
});

export const VoteController = {
  upVoted,
  downVoted,
};