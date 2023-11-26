import { config as configEnv } from 'dotenv';
import { str, num, cleanEnv, url } from 'envalid';

configEnv();

export const envs = cleanEnv(process.env, {
    NODE_ENV: str<NodeEnv>({
        devDefault: 'development',
        choices: ['development', 'test', 'production']
    }),
    JWT_SECRET: str(),
    COOKIE_SECRET: str(),
    CORS_WHITE_LIST: str(),
    BACKEND_URL: str(),
    SMTP_SERVER: str(),
    SMTP_PORT: num(),
    SMTP_USER: str(),
    SMTP_PASSWORD: str(),
    CHECKOUT_ENVIRONMENT: str(),
    PAYPAL_LIVE_ENDPOINT: url(),
    PAYPAL_SANDBOX_ENDPOINT: url(),
    PAYPAL_CLIENT_ID: str(),
    PAYPAL_CLIENT_SECRET: str(),
    MINIO_URL: str()
});

export const CORS_WHITE_LIST = envs.CORS_WHITE_LIST.split(',');
export const PAYPAL_ENDPOINT = envs.CHECKOUT_ENVIRONMENT === 'live' ? envs.PAYPAL_LIVE_ENDPOINT : envs.PAYPAL_SANDBOX_ENDPOINT;
