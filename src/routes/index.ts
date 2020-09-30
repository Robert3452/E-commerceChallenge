import { Router } from 'express';
const router = Router();
import profile from './profile.routes';
import products from './products.routes';
import sales from './sales.routes';

router.use('/profile', profile);
router.use('/products', products);
router.use('/sales', sales);


export default router;