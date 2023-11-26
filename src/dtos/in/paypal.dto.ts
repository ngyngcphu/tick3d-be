import { Static, Type } from '@sinclair/typebox';

// See https://github.com/sinclairzx81/typebox

export const CreatePayPalOrderDto = Type.Object({
    intent: Type.String(),
    orderId: Type.String()
});

export const CompletePayPalOrderDto = Type.Object(
    {
        intent: Type.String({ default: 'CAPTURE' }),
        paypalOrderId: Type.String({ description: 'The id of Paypal order you get when creating' })
    },
    {
        examples: [
            {
                intent: 'CAPTURE',
                paypalOrderId: 'Order_id_is_in_result_of_create_order_api'
            }
        ]
    }
);

export type CreatePayPalOrderDto = Static<typeof CreatePayPalOrderDto>;
export type CompletePayPalOrderDto = Static<typeof CompletePayPalOrderDto>;
