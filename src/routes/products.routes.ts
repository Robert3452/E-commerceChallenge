import { Router } from 'express';
import passport from 'passport';
import * as productServices from '../services/product.services';
import { uploadFile } from '../middleware/multerMid';

const jwtMiddleware = passport.authenticate('jwt', { session: false });
const router = Router();
router.get('/', productServices.getProducts);
router.get('/:id', productServices.getProduct);
router.post('/add',
    jwtMiddleware,
    uploadFile.array('images', 10),
    productServices.createProduct);
router.put('/update/:id',
    jwtMiddleware,
    uploadFile.array('images', 10),
    productServices.updateProduct)

export default router;