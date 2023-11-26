import { Static, Type } from '@sinclair/typebox';

// See https://github.com/sinclairzx81/typebox

export const DefaultModelListResultDto = Type.Array(
    Type.Object({
        id: Type.String(),
        name: Type.String(),
        price: Type.Number(),
        imageUrl: Type.String(),
        likesNo: Type.Number(),
        uploadTime: Type.String({ format: 'date-time' })
    })
);

export type DefaultModelListResultDto = Static<typeof DefaultModelListResultDto>;
