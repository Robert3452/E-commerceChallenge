import passport from 'passport';
import { BasicStrategy } from 'passport-http';
import boom from '@hapi/boom';
import ProfileCrud from '../utils/queries/profile.queries';


const profileCrud = new ProfileCrud();
const basicStrategy = new BasicStrategy(async function (email, password, cb) {
    try {
        const user = await profileCrud.signinVerify(password, email);

        if (!user)
            cb(boom.unauthorized('Email o contraseña incorrecta'));

        return cb(null, user)

    } catch (error) {
        return cb(error, false)
    }
})

passport.use('basic', basicStrategy);