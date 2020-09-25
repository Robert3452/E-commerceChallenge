"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discountSchema = void 0;
const mongoose_1 = require("mongoose");
;
exports.discountSchema = new mongoose_1.Schema({
    discount: { type: Number, },
    offer: { type: String },
    description: { type: String },
    startDate: { type: Date, default: new Date() },
    endDate: { type: Date },
});
