import { OrderQueryStringDto, UpdateOrderDto } from '@dtos/in';
import { OrderListResultDto, OrderResultDto, UpdateOrderResultDto } from '@dtos/out';
import { ordersHandler } from '@handlers';
import { verifyToken, verifyUserRole } from '@hooks';
import { UserRole } from '@prisma/client';
import { Type } from '@sinclair/typebox';
import { createRoutes } from '@utils';

export const orderPlugin = createRoutes('Order', [
    {
        method: 'GET',
        url: '',
        onRequest: [verifyToken],
        schema: {
            summary: 'Get all orders of the current customer. For managers, return all orders',
            querystring: OrderQueryStringDto,
            response: {
                200: OrderListResultDto,
                400: Type.String()
            }
        },
        handler: ordersHandler.getOrders
    },
    {
        method: 'GET',
        url: '/:id',
        onRequest: [verifyToken],
        schema: {
            summary:
                'Get the order with the specified id and owned by the current user. For managers, they can view the order without owning it',
            params: {
                id: Type.String()
            },
            response: {
                200: OrderResultDto,
                404: Type.String(),
                400: Type.String()
            }
        },
        handler: ordersHandler.getOrderById
    },
    {
        method: 'PUT',
        url: '/:id',
        onRequest: [verifyToken, verifyUserRole(UserRole.MANAGER)],
        schema: {
            summary: 'Update the info of an order. For managers only',
            body: UpdateOrderDto,
            params: {
                id: Type.String()
            },
            response: {
                200: UpdateOrderResultDto,
                400: Type.String()
            }
        },
        handler: ordersHandler.update
    },
    {
        method: 'PATCH',
        url: '/:id/paid',
        onRequest: [verifyToken, verifyUserRole(UserRole.MANAGER)],
        schema: {
            summary: 'Update order payment status to true (For Managers Only).',
            description: 'This endpoint is used when the customer pays with cash. Only managers are authorized to use this operation.',
            params: {
                id: Type.String()
            },
            response: {
                200: UpdateOrderResultDto,
                400: Type.String()
            }
        },
        handler: ordersHandler.pay
    },
    {
        method: 'PATCH',
        url: '/:id',
        onRequest: [verifyToken],
        schema: {
            summary: 'Cancel order.',
            description: 'This endpoint is used to cancel an order, but only if the status of the order is pending.',
            params: {
                id: Type.String()
            },
            response: {
                200: UpdateOrderResultDto,
                400: Type.String()
            }
        },
        handler: ordersHandler.cancel
    }
]);
