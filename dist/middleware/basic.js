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
const passport_1 = __importDefault(require("passport"));
const passport_http_1 = require("passport-http");
const boom_1 = __importDefault(require("@hapi/boom"));
const profile_queries_1 = __importDefault(require("../utils/queries/profile.queries"));
const profileCrud = new profile_queries_1.default();
const basicStrategy = new passport_http_1.BasicStrategy(function (email, password, cb) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield profileCrud.signinVerify(password, email);
            if (!user)
                cb(boom_1.default.unauthorized('Email o contraseña incorrecta'));
            return cb(null, user);
        }
        catch (error) {
            return cb(error, false);
        }
    });
});
passport_1.default.use('basic', basicStrategy);
