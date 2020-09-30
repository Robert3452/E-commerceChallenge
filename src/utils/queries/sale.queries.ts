import Product, { IProduct } from '../../models/product/Product';
import Sale, { ISale } from '../../models/sale/Sale';
import ICrud from './queries';
import mongoose from 'mongoose';

class SalesCrud implements ICrud<ISale>{
    async store(json: object): Promise<ISale> {
        try {
            const sale = new Sale(json);
            await sale.save();
            return sale;
        } catch (error) {
            throw error
        }

    }
    update(id: string, json: object): Promise<ISale | null> {
        throw new Error('Method not implemented.');
    }
    delete(id: string): Promise<Object | ISale | null> {
        throw new Error('Method not implemented.');
    }
    getAll(): Promise<ISale[]> {
        throw new Error('Method not implemented.');
    }
    findOneById(id: string): Promise<ISale | null> {
        throw new Error('Method not implemented.');
    }

}

export default SalesCrud;