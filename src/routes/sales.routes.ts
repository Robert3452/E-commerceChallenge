import { Router } from 'express';
import * as saleServices from '../services/sales.services';
import passport from 'passport';

const jwtMiddleware = passport.authenticate('jwt', { session: false });


const router = Router();

router.post('/buy', jwtMiddleware, saleServices.buy);

export default router;