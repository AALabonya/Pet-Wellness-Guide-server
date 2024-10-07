type TMeta = {
  limit: number;
  page: number;
  total: number;
  totalPage: number;
};

export type TPaymentSession = {
  result: boolean;
  payment_url: string;
};

type TToken = {
  accessToken: string;
  refreshToken: string;
};

export type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  token?: TToken;
  paymentSession?: TPaymentSession;
  meta?: TMeta;
  data: T;
};
