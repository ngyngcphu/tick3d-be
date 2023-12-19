import { Type } from '@sinclair/typebox';
import { AuthInputDto, RegisterInputDto, VerifyOTPInputDto } from '@dtos/in';
import { AuthResultDto, RegisterResultDto } from '@dtos/out';
import { authHandler } from '@handlers';
import { createRoutes } from '@utils';

export const authPlugin = createRoutes('Auth', [
    {
        method: 'POST',
        url: '/login',
        schema: {
            body: AuthInputDto,
            response: {
                200: AuthResultDto
            }
        },
        handler: authHandler.login
    },
    {
        method: 'POST',
        url: '/signup',
        schema: {
            body: RegisterInputDto,
            response: {
                200: RegisterResultDto
            }
        },
        handler: authHandler.signup
    },
    {
        method: 'DELETE',
        url: '/logout',
        schema: {
            response: {
                200: Type.Null()
            }
        },
        handler: authHandler.logout
    },
    {
        method: 'POST',
        url: '/otp/verify/:userId',
        schema: {
            summary: 'Verify the OTP for the user',
            params: {
                userId: Type.String()
            },
            body: VerifyOTPInputDto,
            response: {
                200: Type.Object({ message: Type.String() }),
                404: Type.Null()
            }
        },
        handler: authHandler.verifyOTP
    },
    {
        method: 'POST',
        url: '/otp/generate/:userId',
        schema: {
            summary: "Send an email containing the OTP to the user's email",
            params: {
                userId: Type.String()
            },
            response: {
                200: Type.Object({ message: Type.String() }),
                400: Type.String()
            }
        },
        handler: authHandler.sendOTP
    }
]);
