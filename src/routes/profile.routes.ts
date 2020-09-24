import { Router } from 'express';
import * as profileServices from '../services/profile.services';
const router = Router();

router.post('/auth/signin', profileServices.signin);
router.post('/auth/signup', profileServices.signup);

export default router;