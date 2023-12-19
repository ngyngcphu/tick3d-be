import { UploadDefaultModelInputDto, UpdateDefaultModelInputDto, DefaultModelQueryStringDto } from '@dtos/in';
import { DefaultModelListResultDto, DefaultModelResultDto, ToggleLikeResultDto } from '@dtos/out';
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
            querystring: DefaultModelQueryStringDto,
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
            response: { 200: Type.Object({ message: Type.String() }) },
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
            response: { 200: Type.Object({ message: Type.String() }) },
            body: UpdateDefaultModelInputDto
        },
        handler: defaultModelHandler.update
    },
    {
        method: 'POST',
        url: '/:id/toggle-like',
        onRequest: [verifyToken, verifyUserRole(UserRole.CUSTOMER)],
        schema: {
            summary: 'Toggle the `like` status of a customer for a model. The current user is inferred based on jwt',
            params: {
                id: Type.String()
            },
            response: {
                200: ToggleLikeResultDto
            }
        },
        handler: defaultModelHandler.toggleLike
    },
    {
        method: 'PATCH',
        url: '/:id/discontinue',
        onRequest: [verifyToken, verifyUserRole(UserRole.MANAGER)],
        schema: {
            summary: 'Mark Default Model as Discontinued. Also, remove it from all current user carts.',
            params: {
                id: Type.Object({ message: Type.String() })
            },
            response: {
                200: Type.String()
            }
        },
        handler: defaultModelHandler.discontinue
    }
]);
