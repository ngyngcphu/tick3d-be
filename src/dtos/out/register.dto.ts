import { MIN_EMAIL_LENGTH } from '@constants';
import { ObjectId } from '@dtos/common';
import { UserRole } from '@prisma/client';
import { Static, Type } from '@sinclair/typebox';

// See https://github.com/sinclairzx81/typebox

export const RegisterResultDto = Type.Object({
    id: ObjectId,
    email: Type.String({ minLength: MIN_EMAIL_LENGTH }),
    tel: Type.String(),
    lastname: Type.String(),
    firstname: Type.String(),
    role: Type.Union([Type.Literal(UserRole.CUSTOMER), Type.Literal(UserRole.MANAGER)]),
    verified: Type.Boolean()
});

export type RegisterResultDto = Static<typeof RegisterResultDto>;
