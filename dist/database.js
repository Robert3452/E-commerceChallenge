"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./config"));
const dbPassword = encodeURIComponent(config_1.default.dbPassword);
const dbUser = encodeURIComponent(config_1.default.dbUser);
const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
};
const dbUri = `mongodb+srv://${dbUser}:${dbPassword}@${config_1.default.dbHost}/${config_1.default.dbName}?retryWrites=true&w=majority`;
mongoose_1.default.connect(dbUri, dbOptions);
const connection = mongoose_1.default.connection;
connection.once('open', () => {
    console.log('Database connection stablished');
});
connection.on('error', err => {
    console.log(err);
    process.exit(0);
});
