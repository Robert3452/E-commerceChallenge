"use strict";
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
const Product_1 = __importDefault(require("../../models/product/Product"));
class ProductCrud {
    store(json) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = new Product_1.default(json);
                yield product.save();
                return product;
            }
            catch (error) {
                return error;
            }
        });
    }
    update(id, json) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield Product_1.default.updateOne({ _id: id }, { $set: json });
                return product;
            }
            catch (error) {
                return error;
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield Product_1.default.deleteOne({ _id: id });
                return product;
            }
            catch (error) {
                return error;
            }
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield Product_1.default.find({});
                return products;
            }
            catch (error) {
                return error;
            }
        });
    }
    findOneById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield Product_1.default.findById(id);
                return product;
            }
            catch (error) {
                return error;
            }
        });
    }
}
exports.default = ProductCrud;
