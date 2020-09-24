import { Schema, Document } from 'mongoose';

export interface IColor extends Document {
    name: string,
    colorCode: string,
}

export const colorSchema = new Schema({
    name: { type: String, required: true },
    colorCode: { type: String, required: true }
})
