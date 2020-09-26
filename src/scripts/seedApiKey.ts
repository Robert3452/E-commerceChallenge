import chalk from 'chalk';
import crypto from 'crypto';
import Scope from '../models/Scope';
import '../database';

const debug = require('debug')('app:scripts:api-keys');

const adminScopes = [
    'signin:auth',
    'signup:auth',
    'read:products',
    'create:products',
    'update:products',
    'delete:products',
    'read:wishlist',
    'create:wishlist',
    'update:wishlist',
    'delete:wishlist',
];

const publicScopes = [
    'signin:auth',
    'signup:auth',
    'read:products',
    'read:wishlist',
    'create:wishlist',
    'update:wishlist',
    'delete:wishlist',
]

function generateRandomToken() {
    const buffer = crypto.randomBytes(32);
    return buffer.toString('hex');
}

const apiKeys = [
    {
        token: generateRandomToken(),
        scopes: adminScopes
    },
    {
        token: generateRandomToken(),
        scopes: publicScopes
    }
]

async function seedApiKeys() {
    try {
        const promises = apiKeys.map(async apiKeys => {
            let newScope = new Scope();
            newScope.scopes = apiKeys.scopes;
            newScope.token = apiKeys.token;
            return await newScope.save();
        });
        await Promise.all(promises);
    } catch (error) {
        debug(chalk.red(error));
        process.exit(1);
    }
}
seedApiKeys()