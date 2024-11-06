import { Router } from 'express';
import { authentication } from '../../middlewares/authentication';
import { CheckoutController } from '../../controller/checkout.controller';
import { PaymentController } from '../../controller/payment.controller';

const checkoutRouter = Router();

checkoutRouter.post('/', authentication, CheckoutController.handleCheckout);
checkoutRouter.get('/getAll', authentication, CheckoutController.getOrder);
checkoutRouter.get('/get/:id', authentication, CheckoutController.getOrderById);
checkoutRouter.get('/get', authentication, CheckoutController.getOrderByUserId);
checkoutRouter.post('/callback', authentication, CheckoutController.handlePaymentCallback);

export default checkoutRouter;
