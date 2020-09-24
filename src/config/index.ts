import dotenv from 'dotenv';
dotenv.config();

const config = {
    dev: process.env.ENV !== "production",
    port: process.env.PORT || 4000,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbHost: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    publicApiKeysToken: process.env.PUBLIC_API_KEYS_TOKEN,
    adminApiKeysToken: process.env.ADMIN_API_KEYS_TOKEN,
    authJwtSecret: process.env.AUTH_JWT_SECRET,
    cloudname: process.env.CLOUDINARY_CLOUD_NAME,
    apikey: process.env.CLOUDINARY_API_KEY,
    apisecret: process.env.CLOUDINARY_API_SECRET,
    culqiPrivateKey: process.env.PRIVATE_KEY,
    culqiApiSecret: process.env.PUBLIC_KEY
}
export default config;