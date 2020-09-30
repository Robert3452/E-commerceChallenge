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
exports.buy = void 0;
const product_queries_1 = __importDefault(require("../utils/queries/product.queries"));
const profile_queries_1 = __importDefault(require("../utils/queries/profile.queries"));
const paymentsModes_1 = __importDefault(require("../utils/paymentsModes"));
const sale_queries_1 = __importDefault(require("../utils/queries/sale.queries"));
const profileCrud = new profile_queries_1.default();
const salesCrud = new sale_queries_1.default();
const productCrud = new product_queries_1.default();
const paymentModes = new paymentsModes_1.default();
const registerAddress = (user, address) => __awaiter(void 0, void 0, void 0, function* () {
    let idAddress = address.id;
    try {
        const foundUser = yield profileCrud.findByEmail(user.email);
        if (!foundUser)
            throw 'User not found ';
        if (idAddress) {
            const addressFound = foundUser
                .addresses
                .find(element => element._id === idAddress);
            if (!addressFound && !address.address)
                throw 'address not found ';
            return idAddress;
        }
        if (Object.getOwnPropertyNames(address).length < 2)
            throw 'Address body not ';
        idAddress = yield profileCrud.setAddress(foundUser._id, address);
        return idAddress;
    }
    catch (error) {
        throw error;
    }
});
exports.buy = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var response;
    let idProds = new Array();
    let idVariations = new Array();
    let quantities = new Array();
    let subTotals = new Array();
    // let stocks: number[] = new Array();
    let total = 0;
    let { phone, shoppingCart, paymentType: { type, card_number, cvv, expiration_month, expiration_year, email }, address } = req.body;
    let obj = req.user;
    let user = obj.user;
    try {
        shoppingCart.map((el, index) => {
            idProds.push(el.idProduct);
            idVariations.push(el.idVariation);
            quantities.push(el.quantity);
        });
        const products = yield productCrud.findManyVariations(idProds, idVariations);
        products.map((product, index) => {
            // stocks.push(product.variations.stock);
            subTotals.push(product.variations.price * quantities[index]);
            total += subTotals[index];
            shoppingCart[index] = Object.assign(Object.assign({}, shoppingCart[index]), { name: products[index].name, unitCost: products[index].variations.price, subtotal: subTotals[index] });
        });
        const addressRegistered = yield registerAddress(user, address);
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
        };
        var x;
        /** SWITCH Of PAYMENTTYPES  **/
        switch (type) {
            case "card":
                response = yield paymentModes.culqiPaymentMode(card_number, cvv, expiration_month, expiration_year, email, total);
                yield productCrud.updateDetails(idProds, idVariations, quantities);
                x = yield salesCrud.store(sale);
                break;
            case "cash":
                response = { message: "Not implemented yet" };
                break;
            default:
                response = { message: "Payment type not match" };
                break;
        }
        return res.status(200).json({ outcome: response.outcome, message: x || "Nothing to do" });
    }
    catch (error) {
        return next(error);
    }
});
