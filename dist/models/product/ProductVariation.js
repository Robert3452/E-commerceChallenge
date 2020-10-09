"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.variationSchema = void 0;
const mongoose_1 = require("mongoose");
const Color_1 = require("./Color");
const Discount_1 = require("./Discount");
exports.variationSchema = new mongoose_1.Schema({
    size: { type: String, required: true },
    color: { type: Color_1.colorSchema, required: true },
    stock: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true },
    discounts: { type: [Discount_1.discountSchema] },
});
exports.default = mongoose_1.model('product-variation', exports.variationSchema);
