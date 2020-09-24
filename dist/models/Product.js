"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Image_1 = require("./Image");
const ProductVariation_1 = require("./ProductVariation");
const productSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    variations: { type: [ProductVariation_1.variationSchema] },
    images: { type: [Image_1.imageSchema], required: true },
    shortDescription: { type: String },
    description: { type: String },
    owner: { type: mongoose_1.SchemaTypes.ObjectId, ref: 'user' },
});
exports.default = mongoose_1.model('product', productSchema);
