import { Schema, Document } from 'mongoose';

export interface IDiscount extends Document {
    discount: number, //discount in percentage
    offer: string, // discount with 3x2 or 2x1 or something else
    description: string,
    endDate: Date,
    startDate: Date,
};

export const discountSchema = new Schema({
    discount: { type: Number, },
    offer: { type: String },
    description: { type: String },
    startDate: { type: Date, default: new Date() },
    endDate: { type: Date },
});