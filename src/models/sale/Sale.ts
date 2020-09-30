import { Schema, model, Document, SchemaTypes } from 'mongoose';
import { addressSchema, IAddress } from '../Address';
import { IUser } from '../User';
import { IDetail, detailSchema } from './SaleDetail';

export interface ISale extends Document {
    address: IAddress['_id'],
    total: number,
    emissionDate: Date,
    cancelationDate: Date,
    orders: IDetail[],
    stateOfSelling: string,
    igv: number,
    idBuyer: IUser["_id"]
    names: string,
    lastnames: string,
    email: string,
    phone: string,
}

const saleSchema = new Schema({
    address: { type: Schema.Types.ObjectId, required: true, ref: 'address' },
    total: { type: Number },
    emissionDate: { type: Date, default: new Date() },
    cancelationDate: { type: Date },
    orders: { type: [detailSchema] },
    stateOfSelling: { type: String },
    igv: { type: Number, default: 0.18 },

    idBuyer: { type: SchemaTypes.ObjectId, ref: 'user' },
    names: { type: String },
    lastnames: { type: String },
    email: { type: String },
    phone: { type: String }
})

export default model<ISale>('sale', saleSchema);