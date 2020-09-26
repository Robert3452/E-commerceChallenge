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
const chalk_1 = __importDefault(require("chalk"));
const crypto_1 = __importDefault(require("crypto"));
const Scope_1 = __importDefault(require("../models/Scope"));
require("../database");
const debug = require('debug')('app:scripts:api-keys');
const adminScopes = [
    'signin:auth',
    'signup:auth',
    'read:products',
    'create:products',
    'update:products',
    'delete:products',
    'read:wishlist',
    'create:wishlist',
    'update:wishlist',
    'delete:wishlist',
];
const publicScopes = [
    'signin:auth',
    'signup:auth',
    'read:products',
    'read:wishlist',
    'create:wishlist',
    'update:wishlist',
    'delete:wishlist',
];
function generateRandomToken() {
    const buffer = crypto_1.default.randomBytes(32);
    return buffer.toString('hex');
}
const apiKeys = [
    {
        token: generateRandomToken(),
        scopes: adminScopes
    },
    {
        token: generateRandomToken(),
        scopes: publicScopes
    }
];
function seedApiKeys() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const promises = apiKeys.map((apiKeys) => __awaiter(this, void 0, void 0, function* () {
                let newScope = new Scope_1.default();
                newScope.scopes = apiKeys.scopes;
                newScope.token = apiKeys.token;
                return yield newScope.save();
            }));
            yield Promise.all(promises);
        }
        catch (error) {
            debug(chalk_1.default.red(error));
            process.exit(1);
        }
    });
}
seedApiKeys();
