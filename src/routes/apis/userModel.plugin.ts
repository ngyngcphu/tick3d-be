import { UpdateUserModelInputDto, UploadUserModelInputDto } from '@dtos/in';
import { UserModelListResultDto, UserModelResultDto } from '@dtos/out';
import { userModelHandler } from '@handlers';
import { verifyToken, verifyUserRole } from '@hooks';
import { UserRole } from '@prisma/client';
import { Type } from '@sinclair/typebox';
import { createRoutes } from '@utils';

export const userModelPlugin = createRoutes('User Model', [
    {
        method: 'GET',
        url: '',
        onRequest: [verifyToken],
        schema: {
            response: {
                200: UserModelListResultDto
            }
        },
        handler: userModelHandler.getAll
    },
    {
        method: 'POST',
        url: '',
        onRequest: [verifyToken, verifyUserRole(UserRole.CUSTOMER)],
        schema: {
            body: UploadUserModelInputDto,
            response: {
                200: UserModelListResultDto
            }
        },
        handler: userModelHandler.upload
    },
    {
        method: 'GET',
        url: '/:id',
        onRequest: [verifyToken],
        schema: {
            params: {
                id: Type.String()
            },
            response: {
                200: UserModelResultDto
            }
        },
        handler: userModelHandler.get
    },
    {
        method: 'DELETE',
        url: '/:id',
        onRequest: [verifyToken],
        schema: {
            params: {
                id: Type.String()
            }
        },
        handler: userModelHandler.delete
    },
    {
        method: 'PUT',
        url: '/:id',
        onRequest: [verifyToken, verifyUserRole(UserRole.CUSTOMER)],
        schema: {
            params: {
                id: Type.String()
            },
            body: UpdateUserModelInputDto
        },
        handler: userModelHandler.update
    }
]);
