import { CompletePayPalOrderDto, CreatePayPalOrderDto } from '@dtos/in';
import { CompletePaypalDto, PaypalDto } from '@dtos/out';
import { coinHandler } from '@handlers';
import { verifyUserRole } from '@hooks';
import { UserRole } from '@prisma/client';
import { createRoutes } from '@utils';

export const CheckoutPlugin = createRoutes('Checkout', [
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
        handler: coinHandler.completePayPalOrder
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
        handler: coinHandler.createPayPalOrder
    }
]);
