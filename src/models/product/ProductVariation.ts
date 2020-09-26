import { Schema, Document, model } from 'mongoose';
import { colorSchema, IColor } from './Color';
import { discountSchema, IDiscount } from './Discount';

export interface IVariation extends Document {
    size: string,
    color: IColor,
    stock: number,
    price: number,
    discounts: IDiscount[],
}

export const variationSchema = new Schema({
    size: { type: String, required: true },
    color: { type: colorSchema, required: true },
    stock: { type: Number, required: true },
    price: { type: Number, required: true },
    discounts: { type: [discountSchema] },
})

export default model<IVariation>('product-variation', variationSchema);