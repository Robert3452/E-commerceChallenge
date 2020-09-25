"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFiles = exports.uploads = void 0;
const cloudinary_1 = require("cloudinary");
const config_1 = __importDefault(require("../config"));
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloudname,
    api_key: config_1.default.apikey,
    api_secret: config_1.default.apisecret,
});
exports.uploads = (file, folder) => {
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader.upload(file, {
            resource_type: "auto",
            folder: folder
        }, (error, result) => {
            if (error)
                return reject(error);
            else
                return resolve({
                    url: result.url,
                    id: result.public_id
                });
        });
    });
};
exports.deleteFiles = (public_ids) => {
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.api.delete_resources(public_ids, (error, result) => {
            if (error)
                return reject(error);
            return resolve({
                message: result
            });
        });
    });
};
