"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CulqiError {
    constructor(error) {
        this.object = error.object;
        this.type = error.type;
        this.merchant_message = error.merchant_message;
        this.user_message = error.user_message;
        this.charge_id = error.charge_id;
        this.code = error.code;
    }
}
exports.default = CulqiError;
