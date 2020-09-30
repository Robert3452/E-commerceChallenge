import { Request, Response, NextFunction } from 'express';
import ProductCrud from '../utils/queries/product.queries';
import boom from '@hapi/boom';

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


const registerAddress = async (user: any, address: IAddressRequest): Promise<string> => {

    let idAddress = address.id;
    try {
        const foundUser = await profileCrud.findByEmail(user.email);
        if (!foundUser) throw 'User not found '

        if (idAddress) {
            const addressFound =
                foundUser
                    .addresses
                    .find(element => element._id === idAddress)

            if (!addressFound && !address.address) throw 'address not found '

            return idAddress;
        }
        if (Object.getOwnPropertyNames(address).length < 2) throw 'Address body not '

        idAddress = await profileCrud.setAddress(foundUser._id, address)
        return idAddress

    } catch (error) {
        throw error
    }
}

export const buy = async (req: Request, res: Response, next: NextFunction) => {
    var response;
    let idProds: string[] = new Array();
    let idVariations: string[] = new Array();
    let quantities: number[] = new Array();
    let subTotals: number[] = new Array();
    // let stocks: number[] = new Array();
    let total: number = 0;
    let {
        phone,
        shoppingCart,
        paymentType: { type, card_number, cvv, expiration_month, expiration_year, email },
        address
    } = req.body;

    let obj: any = req.user;
    let user = obj.user;

    try {

        shoppingCart.map((el: any, index: number) => {
            idProds.push(el.idProduct);
            idVariations.push(el.idVariation);
            quantities.push(el.quantity);
        });

        const products = await productCrud.findManyVariations(idProds, idVariations)

        products.map((product, index) => {


            // stocks.push(product.variations.stock);
            subTotals.push(product.variations.price * quantities[index]);
            total += subTotals[index];

            shoppingCart[index] = {
                ...shoppingCart[index],
                name: products[index].name,
                unitCost: products[index].variations.price,
                subtotal: subTotals[index]
            }
        });
        const addressRegistered = await registerAddress(user, address);

        let sale = {
            address: addressRegistered,
            total,
            cancelationDate: new Date(),
            orders: shoppingCart,
            stateOfSelling: "finished",
            idBuyer: user._id,
            names: user.names,
            lastnames: user.lastnames,
            email: user.email,
            phone: user.phone || phone

        }
        var x
        /** SWITCH Of PAYMENTTYPES  **/
        switch (type) {
            case "card":
                response = await paymentModes.culqiPaymentMode(card_number, cvv, expiration_month, expiration_year, email, total);
                await productCrud.updateDetails(idProds, idVariations, quantities);
                x = await salesCrud.store(sale);
                break;
            case "cash":
                response = { message: "Not implemented yet" }
                break;
            default:
                response = { message: "Payment type not match" }
                break;
        }

        return res.status(200).json({ outcome: response.outcome, message: x || "Nothing to do" });

    } catch (error) {
        return next(error)
    }
}

