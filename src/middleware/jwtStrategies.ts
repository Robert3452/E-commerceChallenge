import passport from 'passport';
import { Strategy, StrategyOptions, ExtractJwt } from 'passport-jwt';
import config from '../config';
import boom from '@hapi/boom';
import ProfileCrud from '../utils/queries/profile.queries';

const userCrud = new ProfileCrud();

const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.authJwtSecret,
};

const jwtStrategy = new Strategy(opts, async (tokenPayload, cb) => {

    try {
        const user = await userCrud.findByEmail(tokenPayload.email);

        if (!user) return cb(boom.unauthorized(), false);

        return cb(null, user);

    } catch (error) {

    }
})

passport.use(jwtStrategy);