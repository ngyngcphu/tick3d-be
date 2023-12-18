import { CategoryResult } from '@dtos/out';
import { categoryHandler } from '@handlers';
import { createRoutes } from '@utils';

export const categoryPlugin = createRoutes('Category', [
    {
        method: 'GET',
        url: '',
        schema: {
            summary: 'Get all category',
            response: {
                200: CategoryResult
            }
        },
        handler: categoryHandler.get
    }
]);
