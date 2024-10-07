import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import { User } from '../user/user.model';
import { initiatePayment, verifyPayment } from './payment.utils';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { TPaymentInfo } from '../../types/payment.interface';

const confirmationService = async (
  transactionId: string,
  status: string,
  email: string,
) => {
  const verifyResponse = await verifyPayment(transactionId);

  if (verifyResponse && verifyResponse?.pay_status === 'Successful') {
    await User.findOneAndUpdate(
      { email },
      {
        $set: { premiumMember: true },
      },
      { new: true },
    );
  }

  const successTemplate = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          .container {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: center;
          }
          .success {
            color: #4CAF50;
          }
          .cancel {
            color: #f44336;
          }
          .redirect-link {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            border-radius: 5px;
            text-decoration: none;
            color: #fff;
          }
          .success-link {
            background-color: #4CAF50;
          }
          .cancel-link {
            background-color: #f44336;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="${status === 'success' ? 'success' : 'cancel'}">
            Payment ${status === 'success' ? 'Successful' : 'Canceled'}
          </h1>
          <a href="${config.client_url}" class="redirect-link ${status === 'success' ? 'success-link' : 'cancel-link'}">
            ${status === 'success' ? 'Go to Dashboard' : 'Retry Payment'}
          </a>
        </div>
      </body>
    </html>
  `;

  return successTemplate;
};

const paymentForMonetization = async (
  loggerUser: JwtPayload,
  amount: string,
) => {
  const isExistUser = await User.findOne({ email: loggerUser.email });

  if (!isExistUser) {
    throw new AppError(httpStatus.OK, 'User not found');
  }

  if (isExistUser.premiumMember) {
    throw new AppError(httpStatus.OK, 'You are already a premium member');
  }

  const transactionId = `TXN-${Date.now()}${Math.floor(10000 + Math.random()) * 90000}`;

  const paymentInfo: TPaymentInfo = {
    transactionId,
    amount,
    customerName: isExistUser.name,
    customerEmail: isExistUser.email,
    customerPhone: isExistUser.phone,
    customerAddress: isExistUser.address,
  };

  const paymentSession = await initiatePayment(paymentInfo);

  const result = await User.findOneAndUpdate(
    {
      email: loggerUser.email,
    },
    {
      $set: {
        transactionId,
      },
    },
  );

  if (isExistUser) {
    await User.findOneAndUpdate(
      { email: loggerUser.email },
      {
        $set: { premiumMember: true },
      },
    );
  }

  return {
    result,
    paymentSession,
  };
};

const getPaymentInfoUser = async (loggerUser: JwtPayload) => {
  const payment = await User.findOne({
    email: loggerUser.email,
    premiumMember: true,
  });

  if (!payment) {
    throw new AppError(httpStatus.OK, 'User not found');
  }

  return payment;
};

export const PaymentServices = {
  confirmationService,
  paymentForMonetization,
  getPaymentInfoUser,
};
