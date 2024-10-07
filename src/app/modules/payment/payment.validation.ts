import { z } from 'zod';

const paymentValidationSchema = z.object({
  body: z.object({
    amount: z.string({ required_error: 'Amount is required' }),
  }),
});

export const PaymentValidation = {
  paymentValidationSchema,
};
