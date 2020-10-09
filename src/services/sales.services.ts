import { Request, Response, NextFunction } from 'express';
import ProductCrud from '../utils/queries/product.queries';
import boom, { badRequest } from '@hapi/boom';
import { round2Decimals } from '../utils/others/round';
import ProfileCrud from '../utils/queries/profile.queries';

import PaymenyModes from '../utils/paymentsModes';
import SalesCrud from '../utils/queries/sale.queries';

const profileCrud = new ProfileCrud();
const salesCrud = new SalesCrud();
const productCrud = new ProductCrud();
const paymentModes = new PaymenyModes();

interface IAddressRequest {
    id: string,
    address: string,
    reference: string,
    houseOrDepartmentNumber: string,
    postalCode: string,
    department: string,
    province: string,
    district: string,
}

const registerAddress = async (user: any, address: IAddressRequest): Promise<any> => {

    let idAddress = address.id;
    try {
        const foundUser = await profileCrud.findByEmail(user.email);
        if (!foundUser) throw 'User not found '

        if (idAddress) {
            console.log('there is an address')
            const addressFound =
                foundUser
                    .addresses
                    .find(element => {
                        console.log(element)
                        return `${element._id}` === idAddress;
                    })

            if (!addressFound && !address.address) throw 'address not found '

            return addressFound;
        }
        if (Object.getOwnPropertyNames(address).length < 2) throw 'Address body request not found'

        return await profileCrud.setAddress(foundUser._id, address)

    } catch (error) {
        throw error
    }
}

export const buy = async (req: Request, res: Response, next: NextFunction) => {

    const {
        shoppingCart,
        total,
        phone,
        address,
        paymentType: { type, card_number, cvv, expiration_month, expiration_year, email }
    } = req.body;
    let idProds: string[] = new Array();
    let idVariations: string[] = new Array();
    let quantities: number[] = new Array();

    var message
    const tokenData: any = req.user;
    const user = tokenData.user;
    var response;
    var errorStockData ='';

    try {
        let sale = {
            address: address,
            total,
            cancelationDate: new Date(),
            orders: shoppingCart,
            stateOfSelling: "completed",
            idBuyer: user._id,
            names: user.names,
            lastnames: user.lastnames,
            email: user.email,
            phone: user.phone || phone

        }
        shoppingCart.map((el: any) => {
            idProds.push(el.idProduct);
            idVariations.push(el.idVariation);
            quantities.push(el.quantity);
        });
        const products = await productCrud.findManyVariations(idProds, idVariations)
        products.map((el, index) => {
            if (el.variations.stock < quantities[index])
            errorStockData += `Insuficient stock for ${shoppingCart[index].name}, you can select less than ${shoppingCart[index].quantity} \n`  
        });

        if (errorStockData.length > 0) {
            throw next(boom.badRequest(errorStockData))
        }
        /** SWITCH Of PAYMENTTYPES  **/
        switch (type) {
            case "card":
                response = await paymentModes.culqiPaymentMode(card_number, cvv, expiration_month, expiration_year, email, round2Decimals(total));
                /**UPDATE THE STOCK PENDANT*/
                await productCrud.updateDetails(idProds, idVariations, quantities);
                message = await salesCrud.store(sale);
                break;
            case "cash":
                response = { message: "Not implemented yet" }
                break;
            default:
                response = { message: "Payment type not match" }
                break;
        }

        return res.status(200).json({ outcome: response.outcome, message: { advice: "Sale successfully completed", data: message } });

    } catch (error) {
        return next(error)
    }
}

export const setAddress = async (req: Request, res: Response, next: NextFunction) => {
    let { body: address } = req;
    let tokenData: any = req.user;
    let user = tokenData.user;

    try {
        const selectedAddress = await registerAddress(user, address);

        return res.status(200).json({ address: selectedAddress });
    } catch (error) {
        return next(error)
    }
}

export const makeCart = async (req: Request, res: Response, next: NextFunction) => {

    const { body: shoppingCart } = req;
    let idProds: string[] = new Array();
    let idVariations: string[] = new Array();
    let quantities: number[] = new Array();
    let subTotals: number[] = new Array();
    let total: number = 0;

    try {
        shoppingCart.map((el: any) => {
            idProds.push(el.idProduct);
            idVariations.push(el.idVariation);
            quantities.push(el.quantity);
        });

        const products = await productCrud.findManyVariations(idProds, idVariations)

        products.map((product, index) => {
            subTotals.push(round2Decimals(product.variations.price * quantities[index]));
            total += subTotals[index];

            shoppingCart[index] = {
                ...shoppingCart[index],
                name: products[index].name,
                unitCost: products[index].variations.price,
                subtotal: subTotals[index]
            }
        });

        return res.status(200).json({ shoppingCart, total });
    } catch (error) {

    }
}