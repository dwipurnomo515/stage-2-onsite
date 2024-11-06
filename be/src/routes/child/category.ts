import { Router } from 'express'
import categoryController from '../../controller/category.controller';
import { authentication } from '../../middlewares/authentication';

const categoryRouter = Router();

categoryRouter.get('/getAll', categoryController.findAll)
categoryRouter.get('/get', authentication, categoryController.findByUserId)
categoryRouter.get('/get/:id', authentication, categoryController.byId)
categoryRouter.post('/create', authentication, categoryController.create)
categoryRouter.put('/edit/:id', authentication, categoryController.edit)
categoryRouter.delete('/delete/:id', authentication, categoryController.delete)

export default categoryRouter;