import { Static, Type } from '@sinclair/typebox';

// See https://github.com/sinclairzx81/typebox

export const UpdateDefaultModelInputDto = Type.Object({
    name: Type.Optional(Type.String()),
    price: Type.Optional(Type.Number()),
    gcode: Type.Optional(Type.String()),
    imageUrl: Type.Optional(Type.String()),
    category_id: Type.Optional(Type.String())
});

export type UpdateDefaultModelInputDto = Static<typeof UpdateDefaultModelInputDto>;
