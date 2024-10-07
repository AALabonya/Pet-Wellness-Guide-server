import { Router } from 'express';

import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { PaymentController } from './payment.controller';
import { PaymentValidation } from './payment.validation';


const router = Router();

router.post('/confirmation', PaymentController.confirmationController);
router.post(
  '/monetization',
  auth('admin', 'user'),
  validateRequest(PaymentValidation.paymentValidationSchema),
  PaymentController.paymentForMonetization,
);

router.get('/info', auth('admin', 'user'), PaymentController.getPaymentInfo);

export const paymentRoutes = router;
