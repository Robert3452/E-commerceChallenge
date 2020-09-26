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
const passport_jwt_1 = require("passport-jwt");
const config_1 = __importDefault(require("../config"));
const boom_1 = __importDefault(require("@hapi/boom"));
const profile_queries_1 = __importDefault(require("../utils/queries/profile.queries"));
const userCrud = new profile_queries_1.default();
const opts = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config_1.default.authJwtSecret,
};
const jwtStrategy = new passport_jwt_1.Strategy(opts, (tokenPayload, cb) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userCrud.findByEmail(tokenPayload.email);
        if (!user)
            return cb(boom_1.default.unauthorized(), false);
        return cb(null, { user, scopes: tokenPayload.scopes });
    }
    catch (error) {
    }
}));
passport_1.default.use(jwtStrategy);
