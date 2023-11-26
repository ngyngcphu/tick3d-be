import { CompletePayPalOrderDto, CreateOrderInputDto, CreatePayPalOrderDto } from '@dtos/in';
import { CompletePaypalDto, CreateOrderResultDto, PaypalDto } from '@dtos/out';
import { checkoutHandler } from '@handlers';
import { verifyUserRole } from '@hooks';
import { UserRole } from '@prisma/client';
import { createRoutes } from '@utils';

export const CheckoutPlugin = createRoutes('Checkout', [
    {
        method: 'POST',
        url: '',
        onRequest: [verifyUserRole(UserRole.MANAGER)],
        schema: {
            summary: 'Create Order',
            description: `Create an order for this user. This API endpoint facilitates the creation of an order, including the generation of an item for the specified model and its addition to the order. If the user chooses a digital wallet for checkout, ensure to call the appropriate digital checkout API for further processing.`,
            body: CreateOrderInputDto,
            response: {
                200: CreateOrderResultDto
            }
        },
        handler: checkoutHandler.createOrder
    },
    {
        method: 'POST',
        url: '/paypal/completing',
        onRequest: [verifyUserRole(UserRole.MANAGER)],
        schema: {
            summary: 'Complete PayPal Order',
            body: CompletePayPalOrderDto,
            response: {
                200: CompletePaypalDto
            }
        },
        handler: checkoutHandler.completePayPalOrder
    },
    {
        method: 'POST',
        url: '/paypal/creating',
        onRequest: [verifyUserRole(UserRole.MANAGER)],
        schema: {
            summary: 'Create PayPal Order',
            body: CreatePayPalOrderDto,
            response: {
                200: PaypalDto
            }
        },
        handler: checkoutHandler.createPayPalOrder
    }
]);
