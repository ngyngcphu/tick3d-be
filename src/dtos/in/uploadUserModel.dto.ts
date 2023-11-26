import { Static, Type } from '@sinclair/typebox';

// See https://github.com/sinclairzx81/typebox

export const UploadUserModelInputDto = Type.Array(
    Type.Object({
        name: Type.String(),
        gcode: Type.String()
    })
);

export type UploadUserModelInputDto = Static<typeof UploadUserModelInputDto>;
