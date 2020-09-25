"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
const profile_routes_1 = __importDefault(require("./profile.routes"));
const products_routes_1 = __importDefault(require("./products.routes"));
router.use('/profile', profile_routes_1.default);
router.use('/products', products_routes_1.default);
exports.default = router;
