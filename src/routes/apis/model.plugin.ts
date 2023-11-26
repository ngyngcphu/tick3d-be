import { ModelResultDto } from '@dtos/out';
import { modelHandler } from '@handlers';
import { verifyUserRole } from '@hooks';
import { UserRole } from '@prisma/client';
import { Type } from '@sinclair/typebox';
import { createRoutes } from '@utils';

export const modelPlugin = createRoutes('Model', [
    {
        method: 'GET',
        url: '',
        onRequest: [verifyUserRole(UserRole.CUSTOMER)],
        schema: {
            summary: 'Get all default models',
            response: {
                200: Type.Array(ModelResultDto)
            }
        },
        handler: modelHandler.get
    }
]);
