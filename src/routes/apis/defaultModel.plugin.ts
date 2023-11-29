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
            params: {
                id: Type.String()
            },
            body: UpdateDefaultModelInputDto
        },
        handler: defaultModelHandler.update
    }
]);
