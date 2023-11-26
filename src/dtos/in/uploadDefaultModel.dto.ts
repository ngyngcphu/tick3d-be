import { Static, Type } from '@sinclair/typebox';

// See https://github.com/sinclairzx81/typebox

export const UploadDefaultModelInputDto = Type.Array(
    Type.Object({
        name: Type.String(),
        price: Type.Number(),
        gcode: Type.String(),
        imageUrl: Type.String(),
        category_id: Type.String()
    })
);

export type UploadDefaultModelInputDto = Static<typeof UploadDefaultModelInputDto>;
