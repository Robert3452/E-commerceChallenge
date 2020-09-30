"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressSchema = void 0;
const mongoose_1 = require("mongoose");
exports.addressSchema = new mongoose_1.Schema({
    address: { type: String, required: true, unique: true },
    reference: { type: String },
    houseOrDepartmentNumber: { type: String, required: true },
    postalCode: { type: String, required: true },
    // country: { type: String, required: true },
    district: { type: String, required: true },
    department: { type: String, required: true },
    province: { type: String, required: true },
});
exports.default = mongoose_1.model('address', exports.addressSchema);
