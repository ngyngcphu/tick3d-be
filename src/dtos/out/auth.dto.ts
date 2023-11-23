import { ObjectId } from '@dtos/common';
import { UserRole } from '@prisma/client';
import { Static, Type } from '@sinclair/typebox';

export const AuthResultDto = Type.Object({
    id: ObjectId,
    email: Type.String({ format: 'email' }),
    tel: Type.String(),
    firstname: Type.String(),
    lastname: Type.String(),
    role: Type.Union([Type.Literal(UserRole.CUSTOMER), Type.Literal(UserRole.MANAGER)])
});

export type AuthResultDto = Static<typeof AuthResultDto>;
