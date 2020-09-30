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
exports.createCharge = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const config_1 = __importDefault(require("../../config"));
const apiCharge = "https://api.culqi.com/v2/charges";
const private_key = config_1.default.culqiPrivateKey || "";
exports.createCharge = (amount, currency_code, email, source_id) => __awaiter(void 0, void 0, void 0, function* () {
    const body = {
        amount,
        currency_code,
        email,
        source_id //previous token
    };
    const request = {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${private_key}`
        }
    };
    try {
        const response = yield node_fetch_1.default(apiCharge, request);
        const json = yield response.json();
        return json;
    }
    catch (error) {
        return error;
    }
});
