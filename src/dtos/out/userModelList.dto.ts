import { Static, Type } from '@sinclair/typebox';

// See https://github.com/sinclairzx81/typebox

export const UserModelListResultDto = Type.Array(
    Type.Object({
        id: Type.String(),
        name: Type.String(),
        price: Type.Number(),
        uploadTime: Type.String({ format: 'date-time' })
    })
);

export type UserModelListResultDto = Static<typeof UserModelListResultDto>;
