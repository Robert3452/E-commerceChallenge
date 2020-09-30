"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shoppingCartSchema = void 0;
const mongoose_1 = require("mongoose");
exports.shoppingCartSchema = new mongoose_1.Schema({
    idProduct: { type: String },
    idVariation: { type: String },
    quantity: { type: Number },
});
exports.default = mongoose_1.model('shopping-cart', exports.shoppingCartSchema);
