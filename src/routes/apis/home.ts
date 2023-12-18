import { HomeSlideResultDto } from '@dtos/out';
import { homeHandler } from '@handlers';
import { createRoutes } from '@utils';

export const homePlugin = createRoutes('Home', [
    {
        method: 'GET',
        url: '/slides',
        schema: {
            summary: 'Get slide images for home page',
            response: {
                200: HomeSlideResultDto
            }
        },
        handler: homeHandler.getHomeSlides
    }
]);
