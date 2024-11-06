import { Router } from "express"
import productController from "../../controller/product.controller";
import { authentication } from "../../middlewares/authentication";
import upload from "../../middlewares/upload";

const productRouter = Router();

productRouter.get('/getAll', productController.findAll);
productRouter.get('/get/:id', productController.findById);
productRouter.get('/get', authentication, productController.findByUserId);
productRouter.post('/create/:id', authentication, upload.single("photo"), productController.create);
productRouter.put('/edit/:id', authentication, upload.single("photo"), productController.edit);
productRouter.delete('/delete/:id', authentication, productController.delete);

export default productRouter;