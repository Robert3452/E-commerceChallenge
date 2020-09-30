import { Schema, model, Document } from 'mongoose'

export interface IShoppingCart extends Document {
    idProduct: string,
    idVariation: string,
    quantity: number
}

export const shoppingCartSchema = new Schema({
    idProduct: { type: String },
    idVariation: { type: String },
    quantity: { type: Number },
});

export default model<IShoppingCart>('shopping-cart', shoppingCartSchema);