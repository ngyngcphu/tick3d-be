import { Static, Type } from '@sinclair/typebox';

// See https://github.com/sinclairzx81/typebox

export const DefaultModelResultDto = Type.Object({
    id: Type.String(),
    name: Type.String(),
    price: Type.Number(),
    category_id: Type.String(),
    imageUrl: Type.String(),
    likesNo: Type.Number(),
    gcode: Type.String(),
    uploadTime: Type.String({ format: 'date-time' })
});

export type DefaultModelResultDto = Static<typeof DefaultModelResultDto>;
