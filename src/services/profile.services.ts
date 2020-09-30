import { Request, Response, NextFunction } from 'express';
import boom from '@hapi/boom';
import passport from 'passport';
import jwt from 'jsonwebtoken'
import config from '../config';
import ProfileCrud from '../utils/queries/profile.queries';
import fs from 'fs-extra';
import ApiKeys from '../utils/queries/scope.queries';
import * as cloudinary from '../config/cloudinary';

const profileCrud = new ProfileCrud();


const uploader = async (path: string) => await cloudinary.uploads(path, 'avatar');
const deleteImage = async (publicIds: [string]) => await cloudinary.deleteFiles(publicIds);

export const saveShoppingCart = async (req: Request, res: Response, next: NextFunction) => {
    const user: any = req.user || null;
    const { body: shoppingCart } = req;
    try {
        const updatedUser = await profileCrud.update(user._id, { shoppingCart });
        return res.status(200).json({
            message: "shoppingCart saved successfully",
        })
    } catch (error) {
        return next(error);
    }

}

export const setAvatar = async (req: Request, res: Response, next: NextFunction) => {
    const file: any = req.file;
    const { path } = file;
    const newPath: any = await uploader(path);

    const user: any = req.user;

    try {

        if (user.avatar) await deleteImage([user.avatar.id])
        if (!user) throw boom.unauthorized('You have to register')

        user.avatar = { ...newPath };
        await fs.unlink(path);

        const updateUser = await profileCrud.update(user._id, user);
        if (!updateUser) throw boom.badRequest('User not found');


        return res.status(201).json({
            data: newPath,
            message: 'Image uploaded successfully'
        });

    } catch (err) {
        next(err)
    }
}

export const unSetAvatar = async (req: Request, res: Response, next: NextFunction) => {
    var user: any = req.user;

    if (user.avatar) {
        await deleteImage([user.avatar.id]);
        user.avatar = {}
    }
    const userUpdated = await profileCrud.update(user._id!!, user);

    return res.status(200).json({ data: userUpdated })
}

export const signin = async (req: Request, res: Response, next: NextFunction) => {

    passport.authenticate('basic', (error, user) => {
        if (error || !user)
            next(boom.unauthorized());
        req.login(user, { session: false }, async (error) => {
            if (error)
                next(error)

            const apiKeys = new ApiKeys();
            const publicToken = user.isAdmin ?
                config.adminApiKeysToken :
                config.publicApiKeysToken;

            if (!publicToken) return next(boom.unauthorized('Public token scope invalid'))

            const apiKey = await apiKeys.findByToken(publicToken);

            if (!apiKey) return next(boom.unauthorized('scopes not found'));

            const { _id: id, name, email } = user;

            const payload = {
                sub: id,
                name,
                email,
                scopes: apiKey.scopes
            };

            const token = jwt.sign(payload, config.authJwtSecret!!, {
                expiresIn: '30m'
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
