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
const charges_1 = require("./culqiRequests/charges");
const token_1 = require("./culqiRequests/token");
const boom_1 = __importDefault(require("@hapi/boom"));
class PaymentModes {
    changingAStringHundredAmount(amount) {
        const transform = 100;
        return (amount * transform).toString();
    }
    culqiPaymentMode(card_number, cvv, expiration_month, expiration_year, email, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tokenResponse = yield token_1.createToken(card_number, cvv, expiration_month, expiration_year, email);
                const { id } = tokenResponse;
                if (!id || tokenResponse.object === "error")
                    throw boom_1.default.badRequest(tokenResponse.merchant_message);
                const newAmount = this.changingAStringHundredAmount(amount);
                const chargeResponse = yield charges_1.createCharge(newAmount, "PEN", email, id);
                return chargeResponse;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = PaymentModes;
