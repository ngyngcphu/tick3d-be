import { ObjectId } from '@dtos/common';
import { UserRole } from '@prisma/client';
import { Static, Type } from '@sinclair/typebox';

export const UserDto = Type.Object({
    id: ObjectId,
    role: Type.Enum(UserRole),
    email: Type.String({ format: 'email' }),
    VnFormatName: Type.String()
});

export type UserDto = Static<typeof UserDto>;
