import { Schema, Document, model, SchemaTypes } from 'mongoose';
import { addressSchema, IAddress } from './Address';
import { IImage, imageSchema } from './Image';
import { IDetail, detailSchema } from './sale/SaleDetail'
import bcrypt from 'bcrypt';
import { IProduct } from './product/Product';

export interface IUser extends Document {
    names: string,
    lastnames: string,
    password: string,
    email: string,
    addresses: IAddress[],
    phone: string,
    dni: string,
    isAdmin: boolean,
    wishList: IProduct['_id'],
    shoppingCart: IDetail[],
    avatar: IImage,
    comparePasswords: (password: string) => Promise<boolean>
}

const userSchema = new Schema({
    avatar: { required: false, type: imageSchema },
    names: { required: true, type: String, maxlength: 50 },
    lastnames: { required: true, type: String, maxlength: 50 },
    password: { required: true, type: String, minlength: 8 },
    email: { required: true, type: String, unique: true },
    addresses: { type: addressSchema },
    phone: { type: String },
    isAdmin: { type: Boolean, default: false },
    apiKeyToken: { type: String },
    dni: { type: String, maxlength: 8 },
    wishList: { type: [detailSchema] },
    shoppingCart: { type: [SchemaTypes.ObjectId], ref: 'detail' },
})

userSchema.pre<IUser>('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
})

userSchema.methods.comparePasswords = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

export default model<IUser>('user', userSchema);