import { createCharge } from './culqiRequests/charges'
import { createToken } from './culqiRequests/token';

import boom from '@hapi/boom';

class PaymentModes {

    private changingAStringHundredAmount(amount: number): string {
        const transform: number = 100;
        return (amount * transform).toString();
    }
    async culqiPaymentMode(card_number: string, cvv: string, expiration_month: string, expiration_year: string, email: string, amount: number) {
        try {

            const tokenResponse = await createToken(card_number, cvv, expiration_month, expiration_year, email)
            const { id } = tokenResponse;
            if (!id || tokenResponse.object === "error")
                throw boom.badRequest(tokenResponse.merchant_message);

            const newAmount: string = this.changingAStringHundredAmount(amount);

            const chargeResponse = await createCharge(newAmount, "PEN", email, id);
            return chargeResponse;
        } catch (error) {
            throw error
        }
    }

}

export default PaymentModes;