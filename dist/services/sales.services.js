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
exports.makeCart = exports.setAddress = exports.buy = void 0;
const product_queries_1 = __importDefault(require("../utils/queries/product.queries"));
const boom_1 = __importDefault(require("@hapi/boom"));
const round_1 = require("../utils/others/round");
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
            console.log('there is an address');
            const addressFound = foundUser
                .addresses
                .find(element => {
                console.log(element);
                return `${element._id}` === idAddress;
            });
            if (!addressFound && !address.address)
                throw 'address not found ';
            return addressFound;
        }
        if (Object.getOwnPropertyNames(address).length < 2)
            throw 'Address body request not found';
        return yield profileCrud.setAddress(foundUser._id, address);
    }
    catch (error) {
        throw error;
    }
});
exports.buy = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { shoppingCart, total, phone, address, paymentType: { type, card_number, cvv, expiration_month, expiration_year, email } } = req.body;
    let idProds = new Array();
    let idVariations = new Array();
    let quantities = new Array();
    var message;
    const tokenData = req.user;
    const user = tokenData.user;
    var response;
    var errorStockData = '';
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
        };
        shoppingCart.map((el) => {
            idProds.push(el.idProduct);
            idVariations.push(el.idVariation);
            quantities.push(el.quantity);
        });
        const products = yield productCrud.findManyVariations(idProds, idVariations);
        products.map((el, index) => {
            if (el.variations.stock < quantities[index])
                errorStockData += `Insuficient stock for ${shoppingCart[index].name}, you can select less than ${shoppingCart[index].quantity} \n`;
        });
        if (errorStockData.length > 0) {
            throw next(boom_1.default.badRequest(errorStockData));
        }
        /** SWITCH Of PAYMENTTYPES  **/
        switch (type) {
            case "card":
                response = yield paymentModes.culqiPaymentMode(card_number, cvv, expiration_month, expiration_year, email, round_1.round2Decimals(total));
                /**UPDATE THE STOCK PENDANT*/
                yield productCrud.updateDetails(idProds, idVariations, quantities);
                message = yield salesCrud.store(sale);
                break;
            case "cash":
                response = { message: "Not implemented yet" };
                break;
            default:
                response = { message: "Payment type not match" };
                break;
        }
        return res.status(200).json({ outcome: response.outcome, message: { advice: "Sale successfully completed", data: message } });
    }
    catch (error) {
        return next(error);
    }
});
exports.setAddress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { body: address } = req;
    let tokenData = req.user;
    let user = tokenData.user;
    try {
        const selectedAddress = yield registerAddress(user, address);
        return res.status(200).json({ address: selectedAddress });
    }
    catch (error) {
        return next(error);
    }
});
exports.makeCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { body: shoppingCart } = req;
    let idProds = new Array();
    let idVariations = new Array();
    let quantities = new Array();
    let subTotals = new Array();
    let total = 0;
    try {
        shoppingCart.map((el) => {
            idProds.push(el.idProduct);
            idVariations.push(el.idVariation);
            quantities.push(el.quantity);
        });
        const products = yield productCrud.findManyVariations(idProds, idVariations);
        products.map((product, index) => {
            subTotals.push(round_1.round2Decimals(product.variations.price * quantities[index]));
            total += subTotals[index];
            shoppingCart[index] = Object.assign(Object.assign({}, shoppingCart[index]), { name: products[index].name, unitCost: products[index].variations.price, subtotal: subTotals[index] });
        });
        return res.status(200).json({ shoppingCart, total });
    }
    catch (error) {
    }
});
