"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageSchema = void 0;
const mongoose_1 = require("mongoose");
exports.imageSchema = new mongoose_1.Schema({
    uri: { type: String, required: true },
    id: { type: String, required: true }
});
