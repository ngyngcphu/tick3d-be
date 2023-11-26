import { Static, Type } from '@sinclair/typebox';

export const ModelResultDto = Type.Object({
    id: Type.String(),
    image: Type.String(),
    subImages: Type.Array(Type.String()),
    name: Type.String(),
    discount: Type.Optional(Type.Number()),
    price: Type.Number(),
    description: Type.String(),
    numberBought: Type.Number()
});

export type ModelResultDto = Static<typeof ModelResultDto>;
