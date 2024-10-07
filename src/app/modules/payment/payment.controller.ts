import { Request, Response } from 'express';
import { PaymentServices } from './payment.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const confirmationController = async (req: Request, res: Response) => {
  const result = await PaymentServices.confirmationService(
    req.query.transactionId as string,
    req.query.status as string,
    req.query.email as string,
  );
  res.send(result);
};

const paymentForMonetization = catchAsync(async (req, res) => {
  const { result, paymentSession } =
    await PaymentServices.paymentForMonetization(req.user, req.body.amount);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment session initiated successfully',
    paymentSession,
    data: result,
  });
});

const getPaymentInfo = catchAsync(async (req, res) => {
  const result = await PaymentServices.getPaymentInfoUser(req.user);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment info fetched successfully',
    data: result,
  });
});

export const PaymentController = {
  confirmationController,
  paymentForMonetization,
  getPaymentInfo,
};
