import { HomeSlideResultDto } from '@dtos/out';
import { homeHandler } from '@handlers';
import { verifyUserRole } from '@hooks';
import { UserRole } from '@prisma/client';
import { createRoutes } from '@utils';

export const homePlugin = createRoutes('Home', [
    {
        method: 'GET',
        url: '/slides',
        onRequest: [verifyUserRole(UserRole.CUSTOMER)],
        schema: {
            summary: 'Get slide images for home page',
            response: {
                200: HomeSlideResultDto
            }
        },
        handler: homeHandler.getHomeSlides
    }
]);
