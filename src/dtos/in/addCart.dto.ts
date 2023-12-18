import { Static, Type } from '@sinclair/typebox';

// See https://github.com/sinclairzx81/typebox

export const AddCartInputDto = Type.Object({
    models: Type.Array(
        Type.Object({
            id: Type.String({ description: 'The id of the model to add to cart' }),
            quantity: Type.Number({ minimum: 1, description: 'The number to add to cart' })
        })
    )
});

export type AddCartInputDto = Static<typeof AddCartInputDto>;
