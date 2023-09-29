import { FastifyReply, FastifyRequest } from 'fastify';
import { UserRole } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { envs } from '@configs';
import { INVALID_TOKEN, MUST_LOGIN_FIRST, PERMISSION_DENIED } from '@constants';

export function verifyUserRole(roleToVerify: UserRole) {
    return async (req: FastifyRequest, res: FastifyReply) => {
        const token = req.cookies.token;
        if (!token) return res.unauthorized(MUST_LOGIN_FIRST);

        try {
            const decodedPayload = jwt.verify(token, envs.JWT_SECRET) as jwt.JwtPayload;
            req.role = decodedPayload['role'];

            if (req.role !== roleToVerify) {
                return res.forbidden(PERMISSION_DENIED);
            }
        } catch (err) {
            req.log.info(err);
            return res.forbidden(INVALID_TOKEN);
        }
    };
}
