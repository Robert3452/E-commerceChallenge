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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProduct = exports.getProducts = void 0;
const product_queries_1 = __importDefault(require("../utils/queries/product.queries"));
const boom_1 = __importDefault(require("@hapi/boom"));
const cloudinary = __importStar(require("../config/cloudinary"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const productCrud = new product_queries_1.default();
const uploader = (path) => __awaiter(void 0, void 0, void 0, function* () { return yield cloudinary.uploads(path, 'products'); });
const deleteImage = (publicIds) => __awaiter(void 0, void 0, void 0, function* () { return yield cloudinary.deleteFiles(publicIds); });
exports.getProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield productCrud.getAll();
        return res.status(200).json(products);
    }
    catch (error) {
        next(error);
    }
});
exports.getProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield productCrud.findOneById(id);
        return res.status(200).json(product);
    }
    catch (error) {
        return next(error);
    }
});
exports.createProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { body: product } = req;
    const files = req.files;
    try {
        /** UPLOADING TO CLOUDINARY SERVICE */
        const uploaderFunctions = files.map((file) => uploader(file.path));
        let images = yield Promise.all(uploaderFunctions);
        /** DELETING FILES WHEN THERE WERE UPDATED  */
        const unlinkImages = files.map((file) => fs_extra_1.default.unlink(file.path));
        yield Promise.all(unlinkImages);
        /**INTRODUCING THE IMAGES OF THE PRODUCTS */
        product = Object.assign(Object.assign({}, product), { images });
        const productCreated = yield productCrud.store(product);
        return res.status(201).json({
            productId: productCreated._id,
            message: "Product created successfully"
        });
    }
    catch (error) {
        return next(error);
    }
});
exports.updateProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let { body: product } = req;
    const files = req.files;
    try {
        const productFound = yield productCrud.findOneById(id);
        if (!productFound)
            return next(boom_1.default.badRequest('Product not found'));
        const publicIds = productFound.images.map((preImage) => preImage.id);
        const uploaderFunctions = files.map((file) => uploader(file.path));
        let images = yield Promise.all(uploaderFunctions);
        const unlinkImages = files.map((file) => fs_extra_1.default.unlink(file.path));
        yield Promise.all(unlinkImages);
        yield deleteImage(publicIds);
        product = Object.assign(Object.assign({}, product), { images });
        yield productFound.updateOne(product);
        return res.status(200).json({
            productId: id,
            message: "User updated succesfully"
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const product = yield productCrud.findOneById(id);
        if (!product)
            return next(boom_1.default.badRequest('Sorry product not found'));
        const publicIds = product.images.map((image) => image.id);
        yield deleteImage(publicIds);
        yield product.deleteOne();
        return res.status(200).json({
            message: "Product deleted successfully",
            productId: product._id
        });
    }
    catch (error) {
        return next(error);
    }
});
