"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.colorSchema = void 0;
const mongoose_1 = require("mongoose");
exports.colorSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    colorCode: { type: String, required: true }
});
