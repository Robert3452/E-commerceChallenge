import { Schema, Document } from 'mongoose';

export interface IAddress extends Document {
    address: string,
    reference: string,
    houseOrDepartmentNumber: string,
    postalCode: string,
    country: string,
    district: string,
    department: string,
    province: string,
}

export const addressSchema = new Schema({
    address: { type: String, required: true },
    reference: { type: String },
    houseOrDepartmentNumber: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    district: { type: String, required: true },
    department: { type: String, required: true },
    province: { type: String, required: true },
})