"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const boom_1 = __importDefault(require("@hapi/boom"));
const scopesValidationHandler = (allowedScopes) => {
    return (req, res, next) => {
        const tokenData = req.user;
        if (!tokenData || (!tokenData.scopes && !tokenData))
            next(boom_1.default.unauthorized('Missing scopes'));
        const hasAccess = allowedScopes
            .map(allowedScope => tokenData.scopes.includes(allowedScope))
            .find(allowed => Boolean(allowed));
        if (hasAccess)
            next();
        else
            next(boom_1.default.unauthorized('Insuficient scopes'));
    };
};
exports.default = scopesValidationHandler;
