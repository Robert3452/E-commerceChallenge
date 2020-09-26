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
const mongoose_1 = require("mongoose");
const Address_1 = require("./Address");
const Image_1 = require("./Image");
const SaleDetail_1 = require("./sale/SaleDetail");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
    avatar: { required: false, type: Image_1.imageSchema },
    names: { required: true, type: String, maxlength: 50 },
    lastnames: { required: true, type: String, maxlength: 50 },
    password: { required: true, type: String, minlength: 8 },
    email: { required: true, type: String, unique: true },
    addresses: { type: Address_1.addressSchema },
    phone: { type: String },
    isAdmin: { type: Boolean, default: false },
    apiKeyToken: { type: String },
    dni: { type: String, maxlength: 8 },
    wishList: { type: [SaleDetail_1.detailSchema] },
    shoppingCart: { type: [mongoose_1.SchemaTypes.ObjectId], ref: 'detail' },
});
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (!user.isModified('password'))
            return next;
        const salt = yield bcrypt_1.default.genSalt(10);
        const hash = yield bcrypt_1.default.hash(user.password, salt);
        user.password = hash;
    });
});
userSchema.methods.comparePasswords = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(password, this.password);
    });
};
userSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
};
exports.default = mongoose_1.model('user', userSchema);
