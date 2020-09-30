import mongoose, { ConnectionOptions } from 'mongoose';
import config from './config';

const dbPassword = encodeURIComponent(config.dbPassword!!);
const dbUser = encodeURIComponent(config.dbUser!!);

const dbOptions: ConnectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false

}

const dbUri = `mongodb+srv://${dbUser}:${dbPassword}@${config.dbHost}/${config.dbName}?retryWrites=true&w=majority`;

mongoose.connect(dbUri, dbOptions);

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('Database connection stablished');
});

connection.on('error', err => {
    console.log(err);
    process.exit(0);
})

