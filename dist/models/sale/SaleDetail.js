"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detailSchema = void 0;
const mongoose_1 = require("mongoose");
exports.detailSchema = new mongoose_1.Schema({
    name: { type: String, },
    idProduct: { type: mongoose_1.SchemaTypes.ObjectId, ref: 'product' },
    idVariation: { type: mongoose_1.SchemaTypes.ObjectId, ref: 'product-variation' },
    seller: { type: mongoose_1.SchemaTypes.ObjectId, ref: 'user' },
    quantity: { type: Number },
    unitCost: { type: Number },
    subtotal: { type: Number }
});
exports.default = mongoose_1.model('detail', exports.detailSchema);
