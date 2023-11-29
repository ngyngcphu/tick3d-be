import { Static, Type } from '@sinclair/typebox';

// See https://github.com/sinclairzx81/typebox

export const UpdateUserModelInputDto = Type.Object({
    name: Type.Optional(Type.String()),
    price: Type.Optional(Type.Number()),
    gcode: Type.Optional(Type.String())
});

export type UpdateUserModelInputDto = Static<typeof UpdateUserModelInputDto>;
