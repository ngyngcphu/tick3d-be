import { Static, Type } from '@sinclair/typebox';

// See https://github.com/sinclairzx81/typebox

export const UserModelListResultDto = Type.Object({
    total: Type.Number({ minimum: 0 }),
    models: Type.Array(
        Type.Object({
            id: Type.String(),
            name: Type.String(),
            price: Type.Number(),
            uploadTime: Type.String({ format: 'date-time' }),
            isModelInCart: Type.Boolean()
        })
    )
});

export type UserModelListResultDto = Static<typeof UserModelListResultDto>;
