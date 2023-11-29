import { AddCartInputDto } from '@dtos/in';
import { GetCartResultDto } from '@dtos/out';
import { cartHandler } from '@handlers';
import { verifyToken, verifyUserRole } from '@hooks';
import { UserRole } from '@prisma/client';
import { Type } from '@sinclair/typebox';
import { createRoutes } from '@utils';

export const cartPlugin = createRoutes('Cart', [
    {
        method: 'GET',
        url: '',
        onRequest: [verifyToken, verifyUserRole(UserRole.CUSTOMER)],
        schema: {
            summary: 'Get all models in the cart of the current user (based on jwt)',
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
            summary: 'Add a model to the current user (based on jwt)',
            body: AddCartInputDto,
            response: {
                200: Type.String(),
                400: Type.String()
            }
        },
        handler: cartHandler.add
    }
]);
