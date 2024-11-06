import { Router } from 'express';
import { authentication } from '../../middlewares/authentication';
import cartController from '../../controller/cart.controller';
import productController from '../../controller/product.controller';

const cartRouter = Router();


cartRouter.get('/get', authentication, cartController.getCart);
cartRouter.post('/add/:productId', authentication, cartController.add);
cartRouter.put('/update/:cartItemId', authentication, cartController.updateItemQuantity)
cartRouter.delete('/delete/:cartItemId', authentication, cartController.remove)



export default cartRouter;