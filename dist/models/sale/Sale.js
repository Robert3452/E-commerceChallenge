"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Address_1 = require("../Address");
const SaleDetail_1 = require("./SaleDetail");
const saleSchema = new mongoose_1.Schema({
    address: { type: Address_1.addressSchema, required: true },
    total: { type: Number },
    emissionDate: { type: Date },
    cancelationDate: { type: Date },
    orders: { type: [SaleDetail_1.detailSchema] },
    stateOfSelling: { type: String },
    igv: { type: Number, default: 0.18 },
    idBuyer: { type: mongoose_1.SchemaTypes.ObjectId, ref: 'user' },
    names: { type: String },
    lastnames: { type: String },
    email: { type: String },
    phone: { type: String }
});
exports.default = mongoose_1.model('sale', saleSchema);
