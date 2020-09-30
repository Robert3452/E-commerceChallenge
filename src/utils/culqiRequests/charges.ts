import fetch from 'node-fetch';
import config from '../../config';

const apiCharge = "https://api.culqi.com/v2/charges";

const private_key: string = config.culqiPrivateKey || "";

export const createCharge = async (amount: string, currency_code: string, email: string, source_id: string) => {
    const body = {
        amount,
        currency_code,
        email,
        source_id //previous token
    }

    const request = {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${private_key}`
        }

    }

    try {
        const response = await fetch(apiCharge, request);
        const json = await response.json();
        return json;
    } catch (error) {
        return error
    }

}