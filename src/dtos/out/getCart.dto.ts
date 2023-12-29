import { Static, Type } from '@sinclair/typebox';

// See https://github.com/sinclairzx81/typebox

export const GetCartResultDto = Type.Object({
    total: Type.Number(),
    cart: Type.Array(
        Type.Object({
            quantity: Type.Number(),
            id: Type.String(),
            name: Type.String(),
            price: Type.Number(),
            discount: Type.Optional(Type.Number()),
            image: Type.Optional(Type.String())
        })
    )
});

export type GetCartResultDto = Static<typeof GetCartResultDto>;
