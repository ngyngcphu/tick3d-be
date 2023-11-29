import { UserDto } from '@dtos/out';
import { usersHandler } from '@handlers';
import { verifyToken, verifyUserRole } from '@hooks';
import { UserRole } from '@prisma/client';
import { createRoutes } from '@utils';

export const userPlugin = createRoutes('User', [
    {
        method: 'GET',
        url: '',
        onRequest: [verifyToken, verifyUserRole(UserRole.MANAGER)],
        schema: {
            response: {
                200: UserDto
            }
        },
        handler: usersHandler.getUserById
    }
]);
