import nodemailer from 'nodemailer';
import { compare, hash } from 'bcrypt';
import { prisma } from '@repositories';
import { cookieOptions, DUPLICATED_EMAIL, LOGIN_FAIL, SALT_ROUNDS, INVALID_OTP, USER_NOT_FOUND, USER_ALREADY_VERIFIED } from '@constants';
import jwt from 'jsonwebtoken';
import otpGenerator from 'otp-generator';
import { envs } from '@configs';
import { User } from '@prisma/client';
import { AuthInputDto, RegisterInputDto, VerifyOTPInputDto } from '@dtos/in';
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
            tel: true,
            verified: true
        },
        where: { email: req.body.email }
    });
    if (!user) return res.badRequest(LOGIN_FAIL);

    const correctPassword = await compare(req.body.password, user.password_sh);
    if (!correctPassword) return res.badRequest(LOGIN_FAIL);

    if (user.verified) {
        const userToken = jwt.sign({ userId: user.id, role: user.role }, envs.JWT_SECRET);
        res.setCookie('token', userToken, cookieOptions);
    }

    return {
        id: user.id,
        email: user.email,
        firstname: user.first_name,
        lastname: user.last_name,
        tel: user.tel,
        role: user.role,
        verified: user.verified
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
                last_name: req.body.lastname,
                verified: false
            }
        });
    } catch (err) {
        logger.info(err);
        return res.badRequest(DUPLICATED_EMAIL);
    }

    return {
        id: user.id,
        email: user.email,
        tel: user.tel,
        firstname: user.first_name,
        lastname: user.last_name,
        role: user.role,
        verified: false
    };
};

const logout: Handler = async (_req, res) => {
    res.clearCookie('token');
    return null;
};

const verifyOTP: Handler<string, { Params: { userId: string }; Body: VerifyOTPInputDto }> = async (req, res) => {
    const verificationEmail = await prisma.verificationEmail.findFirst({
        select: {
            expiration_time: true
        },
        where: {
            user_id: req.params.userId,
            otp: req.body.otp
        }
    });

    if (!verificationEmail) {
        return res.badRequest(INVALID_OTP);
    }

    if (verificationEmail.expiration_time.getTime() < Date.now()) {
        await prisma.verificationEmail.delete({
            where: {
                user_id: req.params.userId
            }
        });
        return res.badRequest(INVALID_OTP);
    }

    await prisma.verificationEmail.delete({
        where: {
            user_id: req.params.userId
        }
    });

    await prisma.user.update({
        data: {
            verified: true
        },
        where: {
            id: req.params.userId
        }
    });

    return 'Verify successfully !';
};

const sendOTP: Handler<string, { Params: { userId: string } }> = async (req, res) => {
    const { userId } = req.params;
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
        return res.badRequest(USER_ALREADY_VERIFIED);
    }

    await prisma.verificationEmail.deleteMany({
        where: {
            user_id: user.id
        }
    });

    const otp = otpGenerator.generate(6, { upperCaseAlphabets: true, specialChars: false });

    await prisma.verificationEmail.create({
        data: {
            user_id: user.id,
            otp
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
        html: `<p>Enter this OTP to verify your tick3d account: ${otp}</p>`
    });

    return 'Verification email sent';
};

export const authHandler = {
    login,
    signup,
    logout,
    verifyOTP,
    sendOTP
};
