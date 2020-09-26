import { Schema, model, Document, SchemaTypes } from 'mongoose';
import { IProduct } from '../product/Product';
import { IVariation } from '../product/ProductVariation';
import { IUser } from '../User';

export interface IDetail extends Document {
    idProduct: IProduct["_id"],
    idVariation: IVariation['_id'],
    seller: IUser['_id'],
    name: string,
    quantity: number,
    unitCost: number,
    subtotal: number,

}

export const detailSchema = new Schema({
    name: { type: String, },
    idProduct: { type: SchemaTypes.ObjectId, ref: 'product' },
    idVariation: { type: SchemaTypes.ObjectId, ref: 'product-variation' },
    seller: { type: SchemaTypes.ObjectId, ref: 'user' },
    quantity: { type: Number },
    unitCost: { type: Number },
    subtotal: { type: Number }
});

export default model<IDetail>('detail', detailSchema);