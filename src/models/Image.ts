import { Schema, Document } from 'mongoose';

export interface IImage extends Document {
    uri: string,
    id: string
}

export const imageSchema = new Schema({
    url: { type: String, required: true },
    id: { type: String, required: true }
})