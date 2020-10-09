import fetch from 'node-fetch';
import config from '../../config';
import CulqiError, { ICulqiError } from './Culqi';

const publicKey = config.culqiPublicKey;

const apiToken = "https://secure.culqi.com/v2/tokens";


export const createToken =
    async (card_number: string, cvv: string, expiration_month: string, expiration_year: string, email: string) => {

        const body = {
            card_number,
            cvv,
            expiration_month,
            expiration_year,
            email
        }
        const request = {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${publicKey}`
            }
        }
        try {
            const response = await fetch(apiToken, request);
            const json = await response.json();
            if (json.object === 'error') throw new CulqiError(json)
            return json
        } catch (error) {
            throw error
        }

    }