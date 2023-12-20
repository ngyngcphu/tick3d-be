import { AddCartInputDto, DelCartInputDto } from '@dtos/in';
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
            summary: 'Add some models to the cart of the current user (based on jwt)',
            body: AddCartInputDto,
            response: {
                200: Type.Object({ message: Type.String() }),
                400: Type.String()
            }
        },
        handler: cartHandler.add
    },
    {
        method: 'DELETE',
        url: '',
        onRequest: [verifyToken, verifyUserRole(UserRole.CUSTOMER)],
        schema: {
            summary: 'Reset the cart of the current user (based on jwt)',
            response: {
                200: Type.Object({ message: Type.String() })
            }
        },
        handler: cartHandler.delAll
    },
    {
        method: 'POST',
        url: '/delete',
        onRequest: [verifyToken, verifyUserRole(UserRole.CUSTOMER)],
        schema: {
            summary: 'Remove some models from the cart of the current user (based on jwt)',
            body: DelCartInputDto,
            response: {
                200: Type.Object({ message: Type.String() }),
                400: Type.String()
            }
        },
        handler: cartHandler.del
    }
]);
