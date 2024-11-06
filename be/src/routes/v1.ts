import { Router } from "express";
import authRouter from "./child/auth";
import profileRouter from "./child/profile";
import productRouter from "./child/product";
import categoryRouter from "./child/category";
import cartRouter from "./child/cart";
import checkoutRouter from "./child/checkout";

const routerV1 = Router();

routerV1.use('/auth', authRouter);
routerV1.use('/profile', profileRouter);
routerV1.use('/product', productRouter);
routerV1.use('/category', categoryRouter);
routerV1.use('/cart', cartRouter);
routerV1.use('/checkout', checkoutRouter);

export default routerV1;