import { envs } from '@configs';

export const cookieOptions = {
    signed: false,
    secure: envs.isProduction,
    path: '/',
    sameSite: true,
    httpOnly: true
};
