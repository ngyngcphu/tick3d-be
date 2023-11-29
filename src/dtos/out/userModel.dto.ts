import { Static, Type } from '@sinclair/typebox';

// See https://github.com/sinclairzx81/typebox

export const UserModelResultDto = Type.Object({
    id: Type.String(),
    name: Type.String(),
    price: Type.Number(),
    gcode: Type.String(),
    uploadTime: Type.String({ format: 'date-time' })
});

export type UserModelResultDto = Static<typeof UserModelResultDto>;
