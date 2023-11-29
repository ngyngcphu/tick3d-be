import { UploadDefaultModelInputDto, UpdateDefaultModelInputDto } from '@dtos/in';
import { DefaultModelListResultDto, DefaultModelResultDto } from '@dtos/out';
import { defaultModelHandler } from '@handlers';
import { verifyToken, verifyUserRole } from '@hooks';
import { UserRole } from '@prisma/client';
import { Type } from '@sinclair/typebox';
import { createRoutes } from '@utils';

export const defaultModelPlugin = createRoutes('Default Model', [
    {
        method: 'GET',
        url: '',
        onRequest: [],
        schema: {
            summary: 'Get all default models',
            response: {
                200: DefaultModelListResultDto
            }
        },
        handler: defaultModelHandler.getAll
    },
    {
        method: 'POST',
        url: '',
        onRequest: [verifyToken, verifyUserRole(UserRole.MANAGER)],
        schema: {
            summary: 'Upload a default model',
            description: 'Only the manager can do this',
            body: UploadDefaultModelInputDto,
            response: {
                200: DefaultModelListResultDto
            }
        },
        handler: defaultModelHandler.upload
    },
    {
        method: 'GET',
        url: '/:id',
        onRequest: [],
        schema: {
            summary: 'Get a default model with the specified id',
            params: {
                id: Type.String()
            },
            response: {
                200: DefaultModelResultDto
            }
        },
        handler: defaultModelHandler.get
    },
    {
        method: 'DELETE',
        url: '/:id',
        onRequest: [verifyToken, verifyUserRole(UserRole.MANAGER)],
        schema: {
            summary: 'Delete a default model with the specified id',
            description: 'Only the manager can do this',
            params: {
                id: Type.String()
            }
        },
        handler: defaultModelHandler.delete
    },
    {
        method: 'PUT',
        url: '/:id',
        onRequest: [verifyToken, verifyUserRole(UserRole.MANAGER)],
        schema: {
            summary: 'Update a default model with the specified id',
            description: 'Only the manager can do this',
            params: {
                id: Type.String()
            },
            body: UpdateDefaultModelInputDto
        },
        handler: defaultModelHandler.update
    }
]);
