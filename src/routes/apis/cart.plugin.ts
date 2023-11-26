import { AddCartInputDto } from '@dtos/in';
import { GetCartResultDto } from '@dtos/out';
import { cartHandler } from '@handlers';
import { verifyToken, verifyUserRole } from '@hooks';
import { UserRole } from '@prisma/client';
import { createRoutes } from '@utils';

export const cartPlugin = createRoutes('Cart', [
    {
        method: 'GET',
        url: '',
        onRequest: [verifyToken, verifyUserRole(UserRole.CUSTOMER)],
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
        onRequest: [verifyToken, verifyUserRole(UserRole.CUSTOMER)],
        schema: {
            body: AddCartInputDto
        },
        handler: cartHandler.add
    }
]);
