import { UpdateUserModelInputDto, UploadUserModelInputDto, UserModelQueryStringDto } from '@dtos/in';
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
            summary: 'Get all user models',
            description: 'If the user is a manager, it can view all models. If the user is a student, it can view its models',
            querystring: UserModelQueryStringDto,
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
            summary: 'Upload a user-defined model',
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
            summary: 'Get the user model with the specified id',
            description: 'A customer can only view its user models',
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
            summary: 'Delete the user model with the specified id',
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
            summary: 'Update a user model',
            description: 'Only the customer can do this',
            params: {
                id: Type.String()
            },
            body: UpdateUserModelInputDto
        },
        handler: userModelHandler.update
    }
]);
