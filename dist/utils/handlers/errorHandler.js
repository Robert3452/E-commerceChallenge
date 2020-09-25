"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.wrapErrors = exports.logErrors = void 0;
const boom_1 = __importDefault(require("@hapi/boom"));
const config_1 = __importDefault(require("../../config"));
function withErrorStack(error, stack) {
    if (config_1.default.dev)
        return Object.assign(Object.assign({}, error), { stack });
    return error;
}
function logErrors(err, req, res, next) {
    console.log(err);
    return next(err);
}
exports.logErrors = logErrors;
function wrapErrors(err, req, res, next) {
    if (err.hasOwnProperty('_message') || err.hasOwnProperty('path') || err.hasOwnProperty('kind'))
        return next(boom_1.default.badRequest(err));
    if (!err.isBoom) {
        return next(boom_1.default.badImplementation(err));
    }
    return next(err);
}
exports.wrapErrors = wrapErrors;
function errorHandler(err, req, res, next) {
    const { output: { statusCode, payload } } = err;
    return res.status(statusCode).json(withErrorStack(payload, err.stack));
}
exports.errorHandler = errorHandler;
