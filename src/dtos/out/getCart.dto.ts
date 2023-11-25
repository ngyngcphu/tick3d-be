import { Static, Type } from '@sinclair/typebox';

// See https://github.com/sinclairzx81/typebox

export const GetCartResultDto = Type.Array(
    Type.Object({
        model_id: Type.String(),
        quantity: Type.Number(),
        model: Type.Object({
            id: Type.String(),
            name: Type.String(),
            price: Type.Number()
        })
    })
);

export type GetCartResultDto = Static<typeof GetCartResultDto>;
