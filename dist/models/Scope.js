"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const scopeSchema = new mongoose_1.Schema({
    scopes: { type: [String] },
    token: { type: String }
});
exports.default = mongoose_1.model('api-key', scopeSchema);
