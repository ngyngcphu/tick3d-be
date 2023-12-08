import { Static, Type } from '@sinclair/typebox';

// See https://github.com/sinclairzx81/typebox

export const DefaultModelListResultDto = Type.Array(
    Type.Object({
        id: Type.String(),
        name: Type.String(),
        price: Type.Number(),
        imageUrl: Type.String(),
        category_id: Type.String(),
        category: Type.String(),
        likesNo: Type.Number(),
        uploadTime: Type.String({ format: 'date-time' }),
        description: Type.String(),
        numberBought: Type.Number(),
        subImages: Type.Array(Type.String()),
        discount: Type.Optional(Type.Number())
    })
);

export type DefaultModelListResultDto = Static<typeof DefaultModelListResultDto>;
