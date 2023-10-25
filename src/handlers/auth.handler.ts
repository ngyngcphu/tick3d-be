import { compare, hash } from 'bcrypt';
import { prisma } from '@repositories';
import { cookieOptions, DUPLICATED_EMAIL, LOGIN_FAIL, SALT_ROUNDS } from '@constants';
import jwt from 'jsonwebtoken';
import { envs } from '@configs';
import { User, UserRole } from '@prisma/client';
import { AuthInputDto } from '@dtos/in';
import { AuthResultDto } from '@dtos/out';
import { Handler } from '@interfaces';
import { logger } from '@utils';

const login: Handler<AuthResultDto, { Body: AuthInputDto }> = async (req, res) => {
    const user = await prisma.user.findUnique({
        select: {
            id: true,
            password_sh: true,
            account_name: true,
            role: true
        },
        where: { account_name: req.body.accountName }
    });
    if (!user) return res.badRequest(LOGIN_FAIL);

    const correctPassword = await compare(req.body.password, user.password_sh);
    if (!correctPassword) return res.badRequest(LOGIN_FAIL);

    const userToken = jwt.sign({ userId: user.id, role: user.role }, envs.JWT_SECRET);
    res.setCookie('token', userToken, cookieOptions);

    return {
        id: user.id,
        accountName: user.account_name
    };
};

const signup: Handler<AuthResultDto, { Body: AuthInputDto }> = async (req, res) => {
    const hashPassword = await hash(req.body.password, SALT_ROUNDS);
    let user: User;
    try {
        user = await prisma.user.create({
            data: {
                account_name: req.body.accountName,
                password_sh: hashPassword,
                tel: req.body.tel,
                profile_name: req.body.profileName
            }
        });
    } catch (err) {
        logger.info(err);
        return res.badRequest(DUPLICATED_EMAIL);
    }

    const userToken = jwt.sign({ userId: user.id, role: UserRole.CUSTOMER }, envs.JWT_SECRET);
    res.setCookie('token', userToken, cookieOptions);

    return {
        id: user.id,
        accountName: user.account_name
    };
};

const logout: Handler = async (_req, res) => {
    res.clearCookie('token');
    return null;
};

export const authHandler = {
    login,
    signup,
    logout
};
