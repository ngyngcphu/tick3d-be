import { Static, Type } from '@sinclair/typebox';

// See https://github.com/sinclairzx81/typebox

export const AddCartInputDto = Type.Object({
    models: Type.Array(
        Type.Object({
            id: Type.String(),
            quantity: Type.Number()
        })
    )
});

export type AddCartInputDto = Static<typeof AddCartInputDto>;
