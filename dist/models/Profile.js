"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Address_1 = require("./Address");
const Image_1 = require("./Image");
const userSchema = new mongoose_1.Schema({
    avatar: { required: false, type: Image_1.imageSchema },
    names: { required: true, type: String, maxlength: 50 },
    lastnames: { required: true, type: String, maxlength: 50 },
    password: { required: true, type: String, minlength: 8 },
    email: { required: true, type: String },
    addresses: { type: Address_1.addressSchema },
    phone: { type: String },
    dni: { type: String, maxlength: 8 },
    wishList: { type: [mongoose_1.SchemaTypes.ObjectId], ref: 'product' },
});
exports.default = mongoose_1.model('user', userSchema);
