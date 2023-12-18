import { Static, Type } from '@sinclair/typebox';

// See https://github.com/sinclairzx81/typebox

export const CategoryResult = Type.Array(
    Type.Object({
        id: Type.String(),
        name: Type.String()
    })
);

export type CategoryResult = Static<typeof CategoryResult>;
