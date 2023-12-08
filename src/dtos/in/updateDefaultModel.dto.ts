import { Static, Type } from '@sinclair/typebox';

// See https://github.com/sinclairzx81/typebox

export const UpdateDefaultModelInputDto = Type.Object({
    name: Type.Optional(Type.String()),
    price: Type.Optional(Type.Number()),
    gcode: Type.Optional(Type.String()),
    imageUrl: Type.Optional(Type.String()),
    category_id: Type.Optional(Type.String()),
    description: Type.Optional(Type.String()),
    subImageUrls: Type.Optional(Type.Array(Type.String())),
    discount: Type.Optional(Type.Number())
});

export type UpdateDefaultModelInputDto = Static<typeof UpdateDefaultModelInputDto>;
