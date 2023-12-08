import { Static, Type } from '@sinclair/typebox';

// See https://github.com/sinclairzx81/typebox

export const ToggleLikeResultDto = Type.Object({
    userId: Type.String(),
    modelId: Type.String(),
    liked: Type.Boolean()
});

export type ToggleLikeResultDto = Static<typeof ToggleLikeResultDto>;
