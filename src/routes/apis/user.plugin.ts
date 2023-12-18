import { UserDto } from '@dtos/out';
import { usersHandler } from '@handlers';
import { verifyToken } from '@hooks';
import { createRoutes } from '@utils';

export const userPlugin = createRoutes('User', [
    {
        method: 'GET',
        url: '',
        onRequest: [verifyToken],
        schema: {
            response: {
                200: UserDto
            }
        },
        handler: usersHandler.getUserById
    }
]);
