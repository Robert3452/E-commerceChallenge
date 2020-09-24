import { Schema, Document, model, SchemaTypes } from 'mongoose';
import { IImage, imageSchema } from '../Image';
import { IVariation, variationSchema } from './ProductVariation';
import { IUser } from '../User';

export interface IProduct extends Document {
    name: string,
    variations: IVariation[],
    images: IImage[],
    shortDescription: string,
    description: string,
    owner: IUser['_id']

}

const productSchema = new Schema({
    name: { type: String, required: true },
    variations: { type: [variationSchema] },
    images: { type: [imageSchema], required: true },
    shortDescription: { type: String },
    description: { type: String },
    owner: { type: SchemaTypes.ObjectId, ref: 'user' },
});

export default model<IProduct>('product', productSchema);