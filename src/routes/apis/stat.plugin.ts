import { JoinedUserStatQuerystringDto, RevenueStatQuerystringDto, UploadedModelStatQuerystringDto } from '@dtos/in';
import { CategoryStatResultDto, JoinedUserStatResultDto, RevenueStatResultDto, UploadedModelStatResultDto } from '@dtos/out';
import { statHandler } from '@handlers';
import { verifyToken, verifyUserRole } from '@hooks';
import { UserRole } from '@prisma/client';
import { createRoutes } from '@utils';

export const statPlugin = createRoutes('Stat', [
    {
        method: 'GET',
        url: '/category',
        onRequest: [verifyToken, verifyUserRole(UserRole.MANAGER)],
        schema: {
            summary: 'Get product counts by category',
            response: {
                200: CategoryStatResultDto
            }
        },
        handler: statHandler.noByCategory
    },
    {
        method: 'GET',
        url: '/user',
        onRequest: [verifyToken, verifyUserRole(UserRole.MANAGER)],
        schema: {
            summary: 'Summarize the number of joined and old users in a given interval',
            querystring: JoinedUserStatQuerystringDto,
            response: {
                200: JoinedUserStatResultDto
            }
        },
        handler: statHandler.joinedUsers
    },
    {
        method: 'GET',
        url: '/revenue',
        onRequest: [verifyToken, verifyUserRole(UserRole.MANAGER)],
        schema: {
            summary: 'Summarize the total revenue in a given interval',
            querystring: RevenueStatQuerystringDto,
            response: {
                200: RevenueStatResultDto
            }
        },
        handler: statHandler.revenue
    },
    {
        method: 'GET',
        url: '/defaultModel',
        onRequest: [verifyToken, verifyUserRole(UserRole.MANAGER)],
        schema: {
            summary: 'Summarize the total uploaded default models in a given interval',
            querystring: UploadedModelStatQuerystringDto,
            response: {
                200: UploadedModelStatResultDto
            }
        },
        handler: statHandler.uploadedUserModelCount
    }
]);
