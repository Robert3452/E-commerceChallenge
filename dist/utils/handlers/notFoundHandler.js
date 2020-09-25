"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const boom_1 = __importDefault(require("@hapi/boom"));
function notFoundHandler(_req, res) {
    const { output: { statusCode, payload } } = boom_1.default.notFound();
    res.status(statusCode).json(payload);
}
exports.default = notFoundHandler;
