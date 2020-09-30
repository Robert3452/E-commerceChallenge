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
const User_1 = __importDefault(require("../../models/User"));
class ProfileCrud {
    store(json) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = new User_1.default(json);
                yield user.save();
                return user;
            }
            catch (error) {
                return error;
            }
        });
    }
    update(id, json) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userUpadted = yield User_1.default.updateOne({ _id: id }, { $set: json });
                return userUpadted;
            }
            catch (error) {
                return error;
            }
        });
    }
    setAddress(id, json) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.default
                    .findOneAndUpdate({ _id: id }, { $push: { addresses: json } }, { new: true });
                if (!user)
                    throw "User not found";
                const addressSelected = user.addresses.find(el => el.address === json.address);
                return addressSelected === null || addressSelected === void 0 ? void 0 : addressSelected._id;
            }
            catch (error) {
                throw error;
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedUser = yield User_1.default.deleteOne({ _id: id });
                return deletedUser;
            }
            catch (error) {
                return error;
            }
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield User_1.default.find({});
                return users;
            }
            catch (error) {
                return error;
            }
        });
    }
    findOneById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.default.findOne({ _id: id });
                return user;
            }
            catch (error) {
                return error;
            }
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.default.findOne({ email });
                return user;
            }
            catch (error) {
                return error;
            }
        });
    }
    signinVerify(password, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.default.findOne({ email });
                if (!user)
                    return null;
                const signedIn = yield user.comparePasswords(password);
                if (!signedIn)
                    return null;
                return user;
            }
            catch (error) {
                return error;
            }
        });
    }
}
exports.default = ProfileCrud;
