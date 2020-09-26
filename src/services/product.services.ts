import { Response, Request, NextFunction } from 'express';
import ProductCrud from '../utils/queries/product.queries';
import boom from '@hapi/boom';


import * as cloudinary from '../config/cloudinary';
import fs from 'fs-extra';

const productCrud = new ProductCrud();

const uploader = async (path: any) => await cloudinary.uploads(path, 'products');
const deleteImage = async (publicIds: string[]) => await cloudinary.deleteFiles(publicIds);

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await productCrud.getAll();

        return res.status(200).json(products);
    } catch (error) {
        next(error)
    }
}

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const product = await productCrud.findOneById(id);

        return res.status(200).json(product);

    } catch (error) {
        return next(error);
    }
}

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {

    let { body: product } = req;
    const files: any = req.files;

    try {
        /** UPLOADING TO CLOUDINARY SERVICE */
        const uploaderFunctions = files.map((file: any) => uploader(file.path));
        let images = await Promise.all(uploaderFunctions);
        /** DELETING FILES WHEN THERE WERE UPDATED  */
        const unlinkImages = files.map((file: any) => fs.unlink(file.path));
        await Promise.all(unlinkImages)
        /**INTRODUCING THE IMAGES OF THE PRODUCTS */
        product = { ...product, images }

        const productCreated = await productCrud.store(product);

        return res.status(201).json({
            productId: productCreated._id,
            message: "Product created successfully"
        });

    } catch (error) {
        return next(error);
    }
}

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    let { body: product } = req;

    const files: any = req.files;
    try {
        const productFound = await productCrud.findOneById(id);

        if (!productFound) return next(boom.badRequest('Product not found'))

        const publicIds: any = productFound.images.map((preImage) => preImage.id)
        const uploaderFunctions = files.map((file: any) => uploader(file.path));

        let images = await Promise.all(uploaderFunctions);

        const unlinkImages = files.map((file: any) => fs.unlink(file.path));

        await Promise.all(unlinkImages);
        await deleteImage(publicIds);

        product = { ...product, images };

        await productFound.updateOne(product);

        return res.status(200).json({
            productId: id,
            message: "User updated succesfully"
        });
    } catch (error) {
        next(error)
    }
}

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const product = await productCrud.findOneById(id);
        if (!product) return next(boom.badRequest('Sorry product not found'));

        const publicIds: string[] = product.images.map((image) => image.id)

        await deleteImage(publicIds);
        await product.deleteOne();

        return res.status(200).json({
            message: "Product deleted successfully",
            productId: product._id
        })

    } catch (error) {
        return next(error);
    }
}