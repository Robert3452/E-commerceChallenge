import { Router } from 'express';
const router = Router();
import profile from './profile.routes';

router.use('/profile', profile);


export default router;