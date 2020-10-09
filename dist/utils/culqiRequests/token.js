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
exports.createToken = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const config_1 = __importDefault(require("../../config"));
const Culqi_1 = __importDefault(require("./Culqi"));
const publicKey = config_1.default.culqiPublicKey;
const apiToken = "https://secure.culqi.com/v2/tokens";
exports.createToken = (card_number, cvv, expiration_month, expiration_year, email) => __awaiter(void 0, void 0, void 0, function* () {
    const body = {
        card_number,
        cvv,
        expiration_month,
        expiration_year,
        email
    };
    const request = {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicKey}`
        }
    };
    try {
        const response = yield node_fetch_1.default(apiToken, request);
        const json = yield response.json();
        if (json.object === 'error')
            throw new Culqi_1.default(json);
        return json;
    }
    catch (error) {
        throw error;
    }
});
