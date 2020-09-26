import { Router } from 'express';
import passport from 'passport';
import * as productServices from '../services/product.services';
import { uploadFile } from '../middleware/multerMid';
import sValidator from '../middleware/scopesValidationHandler';

const jwtMiddleware = passport.authenticate('jwt', { session: false });
const router = Router();
router.get('/', productServices.getProducts);
router.get('/:id', productServices.getProduct);

router.post('/add',
    jwtMiddleware,
    sValidator(['create:products']),
    uploadFile.array('images', 10),
    productServices.createProduct);

router.put('/update/:id',
    jwtMiddleware,
    sValidator(['update:products']),
    uploadFile.array('images', 10),
    productServices.updateProduct);

router.delete('/delete/:id',
    jwtMiddleware,
    sValidator(['delete:products']),
    productServices.deleteProduct);

export default router;