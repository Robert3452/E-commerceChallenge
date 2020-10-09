import { Router } from 'express';
import * as profileServices from '../services/profile.services';
import passport from 'passport';
import { uploadFile } from '../middleware/multerMid';
// import sValidator from '../middleware/scopesValidationHandler'
const router = Router();

const jwtMiddleware = passport.authenticate('jwt', { session: false });

router.post('/auth/signin', profileServices.signin);
router.post('/auth/signup', profileServices.signup);
router.put('/unset-avatar',
    jwtMiddleware,
    profileServices.unSetAvatar);
router.put('/avatar',
    jwtMiddleware,
    uploadFile.single('image'),
    profileServices.setAvatar);
export default router;