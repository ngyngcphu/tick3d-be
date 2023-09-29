import { Type } from '@sinclair/typebox';
import { AuthInputDto } from '@dtos/in';
import { AuthResultDto } from '@dtos/out';
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
            body: AuthInputDto,
            response: {
                200: AuthResultDto
            }
        },
        handler: authHandler.signup
    },
    {
        method: 'POST',
        url: '/logout',
        schema: {
            response: {
                200: Type.Null()
            }
        },
        handler: authHandler.logout
    }
]);
