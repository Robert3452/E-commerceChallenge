import Product, { IProduct } from '../../models/product/Product';
import Crud from './queries';

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


}

export default ProductCrud;