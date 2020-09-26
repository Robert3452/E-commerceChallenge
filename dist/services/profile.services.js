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
exports.signup = exports.signin = exports.unSetAvatar = exports.setAvatar = exports.saveShoppingCart = void 0;
const boom_1 = __importDefault(require("@hapi/boom"));
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const profile_queries_1 = __importDefault(require("../utils/queries/profile.queries"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const scope_queries_1 = __importDefault(require("../utils/queries/scope.queries"));
const cloudinary = __importStar(require("../config/cloudinary"));
const profileCrud = new profile_queries_1.default();
const uploader = (path) => __awaiter(void 0, void 0, void 0, function* () { return yield cloudinary.uploads(path, 'avatar'); });
const deleteImage = (publicIds) => __awaiter(void 0, void 0, void 0, function* () { return yield cloudinary.deleteFiles(publicIds); });
exports.saveShoppingCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user || null;
    const { body: shoppingCart } = req;
    try {
        const updatedUser = yield profileCrud.update(user._id, { shoppingCart });
        console.log(updatedUser);
        return res.status(200).json({
            message: "shoppingCart saved successfully",
        });
    }
    catch (error) {
        return next(error);
    }
});
exports.setAvatar = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    const { path } = file;
    const newPath = yield uploader(path);
    const user = req.user;
    try {
        if (user.avatar)
            yield deleteImage([user.avatar.id]);
        if (!user)
            throw boom_1.default.unauthorized('You have to register');
        user.avatar = Object.assign({}, newPath);
        yield fs_extra_1.default.unlink(path);
        const updateUser = yield profileCrud.update(user._id, user);
        if (!updateUser)
            throw boom_1.default.badRequest('User not found');
        return res.status(201).json({
            data: newPath,
            message: 'Image uploaded successfully'
        });
    }
    catch (err) {
        next(err);
    }
});
exports.unSetAvatar = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var user = req.user;
    if (user.avatar) {
        yield deleteImage([user.avatar.id]);
        user.avatar = {};
    }
    const userUpdated = yield profileCrud.update(user._id, user);
    return res.status(200).json({ data: userUpdated });
});
exports.signin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate('basic', (error, user) => {
        if (error || !user)
            next(boom_1.default.unauthorized());
        req.login(user, { session: false }, (error) => __awaiter(void 0, void 0, void 0, function* () {
            if (error)
                next(error);
            const apiKeys = new scope_queries_1.default();
            const publicToken = user.isAdmin ?
                config_1.default.adminApiKeysToken :
                config_1.default.publicApiKeysToken;
            if (!publicToken)
                return next(boom_1.default.unauthorized('Public token scope invalid'));
            const apiKey = yield apiKeys.findByToken(publicToken);
            if (!apiKey)
                return next(boom_1.default.unauthorized('scopes not found'));
            const { _id: id, name, email } = user;
            const payload = {
                sub: id,
                name,
                email,
                scopes: apiKey.scopes
            };
            const token = jsonwebtoken_1.default.sign(payload, config_1.default.authJwtSecret, {
                expiresIn: '30m'
            });
            return res.status(200).json({ token, user: { id, name, email } });
        }));
    })(req, res, next);
});
exports.signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body: user } = req;
        const createdUser = yield profileCrud.store(user);
        res.status(201).json({
            data: createdUser._id,
            message: "User created",
        });
    }
    catch (error) {
        next(error);
    }
});
