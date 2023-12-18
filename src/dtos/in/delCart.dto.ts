import { Static, Type } from '@sinclair/typebox';

// See https://github.com/sinclairzx81/typebox

export const DelCartInputDto = Type.Object({
    models: Type.Array(Type.String(), { description: 'A list of model ids to delete from the cart' })
});

export type DelCartInputDto = Static<typeof DelCartInputDto>;
