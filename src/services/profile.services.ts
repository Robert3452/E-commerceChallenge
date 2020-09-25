import { Request, Response, NextFunction } from 'express';
import boom from '@hapi/boom';
import passport from 'passport';
import jwt from 'jsonwebtoken'
import config from '../config';
import ProfileCrud from '../utils/queries/profile.queries';
import fs from 'fs-extra';

import * as cloudinary from '../config/cloudinary';

const profileCrud = new ProfileCrud();


const uploader = async (path: string) => await cloudinary.uploads(path, 'avatar');
const deleteImage = async (publicIds: [any]) => await cloudinary.deleteFiles(publicIds);

export const setAvatar = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const file: any = req.file;
        const { path } = file;
        const newPath: any = await uploader(path);

        const user: any = req.user;

        let response: any;
        if (user.avatar)
            response = await deleteImage([user.avatar.id])
        console.log(`Response`, response)

        if (!user) throw boom.unauthorized('You have to register')

        user.avatar = { ...newPath };
        fs.unlinkSync(path);

        const updateUser = await profileCrud.update(user._id, user);
        if (!updateUser) throw boom.badRequest('User not found');


        return res.status(201).json({
            data: newPath,
            avatar: updateUser.avatar,
            message: 'Image uploaded successfully'
        });

    } catch (err) {
        next(err)
    }
}

export const unSetAvatar = async (req: Request, res: Response, next: NextFunction) => {
    // const { path } = req.file;
    const user: any = req.user;

    var response: any;

    if (user.avatar)
        response = await deleteImage([user.avatar.id]);
    else
        response = { message: "NO response" }
    return res.status(200).json(response)
}

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
