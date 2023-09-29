import { compare, hash } from 'bcrypt';
import { prisma } from '@repositories';
import { cookieOptions, DUPLICATED_EMAIL, LOGIN_FAIL, SALT_ROUNDS, USER_NOT_FOUND } from '@constants';
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
            email: true,
            password: true,
            role: true
        },
        where: { email: req.body.email }
    });
    if (!user) return res.badRequest(USER_NOT_FOUND);

    const correctPassword = await compare(req.body.password, user.password);
    if (!correctPassword) return res.badRequest(LOGIN_FAIL);

    const userToken = jwt.sign({ userId: user.id, role: user.role }, envs.JWT_SECRET);
    res.setCookie('token', userToken, cookieOptions);

    return {
        id: user.id,
        email: user.email
    };
};

const signup: Handler<AuthResultDto, { Body: AuthInputDto }> = async (req, res) => {
    const hashPassword = await hash(req.body.password, SALT_ROUNDS);
    let user: User;
    try {
        user = await prisma.user.create({
            data: {
                email: req.body.email,
                password: hashPassword
            }
        });
    } catch (err) {
        logger.info(err);
        return res.badRequest(DUPLICATED_EMAIL);
    }

    const userToken = jwt.sign({ userId: user.id, role: UserRole.USER }, envs.JWT_SECRET);
    res.setCookie('token', userToken, cookieOptions);

    return {
        id: user.id,
        email: user.email
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
