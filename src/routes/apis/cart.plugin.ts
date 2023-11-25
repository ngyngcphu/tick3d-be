import { AddCartInputDto } from '@dtos/in';
import { GetCartResultDto } from '@dtos/out';
import { cartHandler } from '@handlers';
import { verifyUserRole } from '@hooks';
import { UserRole } from '@prisma/client';
import { createRoutes } from '@utils';

export const cartPlugin = createRoutes('Cart', [
    {
        method: 'GET',
        url: '',
        onRequest: [verifyUserRole(UserRole.CUSTOMER)],
        schema: {
            response: {
                200: GetCartResultDto
            }
        },
        handler: cartHandler.get
    },
    {
        method: 'POST',
        url: '',
        onRequest: [verifyUserRole(UserRole.CUSTOMER)],
        schema: {
            body: AddCartInputDto
        },
        handler: cartHandler.add
    }
]);
