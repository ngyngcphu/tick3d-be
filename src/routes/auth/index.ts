import { Type } from '@sinclair/typebox';
import { AuthInputDto, RegisterInputDto } from '@dtos/in';
import { AuthResultDto, RegisterResultDto } from '@dtos/out';
import { authHandler } from '@handlers';
import { createRoutes } from '@utils';
import { verifyToken } from '@hooks';

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
        method: 'GET',
        url: '/verify/:id',
        schema: {
            params: {
                id: Type.String()
            },
            response: {
                200: Type.Null(),
                404: Type.Null()
            }
        },
        handler: authHandler.verifyLink
    },
    {
        method: 'POST',
        url: '/verify',
        onRequest: [verifyToken],
        schema: {
            response: {
                200: Type.Null(),
                400: Type.Null()
            }
        },
        handler: authHandler.sendVerifyLink
    }
]);
