import Product, { IProduct } from '../../models/product/Product';
import Crud from './queries';
import mongoose, { mongo } from 'mongoose';

interface IResponseVariation {
    _id: string,
    size: string,
    stock: number,
    price: number,
    color: {
        _id: string,
        name: string,
        colorCode: string
    },
    discounts: any[]
}

interface IProductsResponse {
    _id: string,
    name: string,
    variations: IResponseVariation
}

class ProductCrud implements Crud<IProduct>{
    async store(json: object): Promise<IProduct> {
        try {
            const product = new Product(json);
            await product.save();
            return product;
        } catch (error) {
            return error;
        }
    }
    async update(id: string, json: object): Promise<IProduct | null> {
        try {
            const product = await Product.updateOne({ _id: id }, { $set: json })
            return product
        } catch (error) {
            return error
        }
    }
    async delete(id: string): Promise<Object | IProduct | null> {
        try {
            const product = await Product.deleteOne({ _id: id });
            return product
        } catch (error) {
            return error
        }
    }
    async getAll(): Promise<IProduct[]> {
        try {
            const products = await Product.find({})
            return products;
        } catch (error) {
            return error
        }
    }
    async findOneById(id: string): Promise<IProduct | null> {
        try {
            const product = await Product.findById(id);
            return product;
        } catch (error) {
            return error
        }
    }


    async findManyVariations(idsProd: string[], idsVariation: string[]): Promise<IProductsResponse[]> {
        const prods = idsProd.map(el => mongoose.Types.ObjectId(el));
        const vars = idsVariation.map(el => mongoose.Types.ObjectId(el));
        try {

            let products: IProductsResponse[] = await Product.aggregate([
                { $match: { _id: { $in: prods } } },
                { $unwind: "$variations" },
                { $match: { "variations._id": { $in: vars } } },
                { $project: { name: 1, owner: 1, variations: { stock: 1, price: 1, _id: 1, color: 1, size: 1, discounts: 1 } } }
            ]);
            if (!products || products.length <= 0) throw "There aren't coincidences"
            return products;
        } catch (error) {
            return error
        }
    }

    async updateDetails(idsProd: string[], idsVariation: string[], stockDiscount: number[]): Promise<void> {
        try {
            let pipeline = idsProd.map((element, index) => ({
                updateOne: {
                    "filter": { _id: element, "variations._id": mongoose.Types.ObjectId(idsVariation[index]) },
                    "update": { $inc: { "variations.$.stock": -stockDiscount[index] } }
                }
            }));
            await Product.bulkWrite(pipeline);
        } catch (error) {
            return error
        }
    }
}

export default ProductCrud;