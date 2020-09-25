import { Router } from 'express';
const router = Router();
import profile from './profile.routes';
import products from './products.routes';

router.use('/profile', profile);
router.use('/products', products);


export default router;