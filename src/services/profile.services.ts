import { Request, Response, NextFunction } from 'express';
import boom from '@hapi/boom';
import passport from 'passport';
import jwt from 'jsonwebtoken'
import config from '../config';
import ProfileCrud from '../utils/queries/profile.querie';

const profileCrud = new ProfileCrud();

export const signin = async (req: Request, res: Response, next: NextFunction) => {

    passport.authenticate('basic', (error, user) => {
        if (error || !user)
            next(boom.unauthorized());
        req.login(user, { session: false }, async (error) => {
            if (error)
                next(error)


            const { _id: id, name, email } = user;
            const payload = {
                sub: id,
                name,
                email
            };

            const token = jwt.sign(payload, config.authJwtSecret!!, {
                expiresIn: '15m'
            });
            return res.status(200).json({ token, user: { id, name, email } });

        })
    })(req, res, next)

}


export const signup = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { body: user } = req;
        const createdUser = await profileCrud.store(user);

        res.status(201).json({
            data: createdUser._id,
            message: "User created",
        })
    } catch (error) {
        next(error);
    }
}