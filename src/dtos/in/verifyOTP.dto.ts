import { Static, Type } from '@sinclair/typebox';

// See https://github.com/sinclairzx81/typebox

export const VerifyOTPInputDto = Type.Object({
    otp: Type.String()
});

export type VerifyOTPInputDto = Static<typeof VerifyOTPInputDto>;
