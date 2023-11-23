import nodemailer from 'nodemailer';
import { compare, hash } from 'bcrypt';
import { prisma } from '@repositories';
import { cookieOptions, DUPLICATED_EMAIL, LOGIN_FAIL, SALT_ROUNDS, INVALID_VERIFICATION_LINK, USER_NOT_FOUND } from '@constants';
import jwt from 'jsonwebtoken';
import { envs } from '@configs';
import { User, UserRole } from '@prisma/client';
import { AuthInputDto, RegisterInputDto } from '@dtos/in';
import { AuthResultDto, RegisterResultDto } from '@dtos/out';
import { Handler } from '@interfaces';
import { logger } from '@utils';

const login: Handler<AuthResultDto, { Body: AuthInputDto }> = async (req, res) => {
    const user = await prisma.user.findUnique({
        select: {
            id: true,
            password_sh: true,
            email: true,
            role: true,
            first_name: true,
            last_name: true,
            tel: true
        },
        where: { email: req.body.email }
    });
    if (!user) return res.badRequest(LOGIN_FAIL);

    const correctPassword = await compare(req.body.password, user.password_sh);
    if (!correctPassword) return res.badRequest(LOGIN_FAIL);

    const userToken = jwt.sign({ userId: user.id, role: user.role }, envs.JWT_SECRET);
    res.setCookie('token', userToken, cookieOptions);

    return {
        id: user.id,
        email: user.email,
        firstname: user.first_name,
        lastname: user.last_name,
        tel: user.tel,
        role: user.role
    };
};

const signup: Handler<RegisterResultDto, { Body: RegisterInputDto }> = async (req, res) => {
    const hashPassword = await hash(req.body.password, SALT_ROUNDS);
    let user: User;
    try {
        user = await prisma.user.create({
            data: {
                email: req.body.email,
                password_sh: hashPassword,
                tel: req.body.tel,
                first_name: req.body.firstname,
                last_name: req.body.lastname
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
        email: user.email,
        tel: user.tel,
        firstname: user.first_name,
        lastname: user.last_name,
        role: user.role
    };
};

const logout: Handler = async (_req, res) => {
    res.clearCookie('token');
    return null;
};

const verifyLink: Handler<string, { Params: { id: string } }> = async (req, res) => {
    const verificationEmail = await prisma.verificationEmail.findFirst({
        select: {
            user_id: true,
            expiration_date: true
        },
        where: {
            id: req.params.id
        }
    });

    if (!verificationEmail) {
        return res.badRequest(INVALID_VERIFICATION_LINK);
    }

    if (verificationEmail.expiration_date.getTime() < Date.now()) {
        await prisma.verificationEmail.delete({
            where: {
                id: req.params.id
            }
        });
        return res.badRequest(INVALID_VERIFICATION_LINK);
    }

    await prisma.user.update({
        data: {
            verified: true
        },
        where: {
            id: verificationEmail.user_id
        }
    });

    return 'Verify successfully !';
};

const sendVerifyLink: Handler = async (req, res) => {
    const userId = req.userId;
    const user = await prisma.user.findUnique({
        select: {
            id: true,
            verified: true,
            email: true
        },
        where: { id: userId }
    });

    if (!user) {
        return res.badRequest(USER_NOT_FOUND);
    }

    if (user.verified) {
        return null;
    }

    await prisma.verificationEmail.deleteMany({
        where: {
            user_id: user.id
        }
    });

    const verificationEmail = await prisma.verificationEmail.create({
        data: {
            user_id: user.id
        }
    });

    const mailer = nodemailer.createTransport({
        host: envs.SMTP_SERVER,
        port: envs.SMTP_PORT,
        secure: false,
        auth: {
            user: envs.SMTP_USER,
            pass: envs.SMTP_PASSWORD
        }
    });

    mailer.sendMail({
        from: '"Tick3d" <tick3d@no-reply>',
        to: user.email,
        subject: 'Tick3d verification link',
        html: `<p>Click this link to verify your tick3d account: <a>${envs.BACKEND_URL}/auth/verify/${verificationEmail.id}</a></p>`
    });

    return null;
};

export const authHandler = {
    login,
    signup,
    logout,
    verifyLink,
    sendVerifyLink
};
