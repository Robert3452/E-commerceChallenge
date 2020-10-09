
export interface ICulqiError {
    object: string,
    type: string,
    merchant_message: string,
    user_message: string,
    charge_id: string,
    code: string
}

class CulqiError implements ICulqiError {
    object: string;
    type: string;
    merchant_message: string;
    user_message: string;
    charge_id: string;
    code: string;
    constructor(error: ICulqiError) {
        this.object = error.object;
        this.type = error.type;
        this.merchant_message = error.merchant_message;
        this.user_message = error.user_message;
        this.charge_id = error.charge_id;
        this.code = error.code;
    }
}

export default CulqiError;