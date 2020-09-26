"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const productServices = __importStar(require("../services/product.services"));
const multerMid_1 = require("../middleware/multerMid");
const scopesValidationHandler_1 = __importDefault(require("../middleware/scopesValidationHandler"));
const jwtMiddleware = passport_1.default.authenticate('jwt', { session: false });
const router = express_1.Router();
router.get('/', productServices.getProducts);
router.get('/:id', productServices.getProduct);
router.post('/add', jwtMiddleware, scopesValidationHandler_1.default(['create:products']), multerMid_1.uploadFile.array('images', 10), productServices.createProduct);
router.put('/update/:id', jwtMiddleware, scopesValidationHandler_1.default(['update:products']), multerMid_1.uploadFile.array('images', 10), productServices.updateProduct);
router.delete('/delete/:id', jwtMiddleware, scopesValidationHandler_1.default(['delete:products']), productServices.deleteProduct);
exports.default = router;
