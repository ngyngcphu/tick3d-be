import { Static, Type } from '@sinclair/typebox';

// See https://github.com/sinclairzx81/typebox

export const CreatePayPalOrderDto = Type.Object({
    orderInfo: Type.Object({
        district: Type.String(),
        ward: Type.String(),
        street: Type.String(),
        streetNo: Type.String(),
        extra_note: Type.String()
    }),
    intent: Type.String()
});

export const CompletePayPalOrderDto = Type.Object(
    {
        intent: Type.String({ default: 'CAPTURE' }),
        paypalOrderId: Type.String({ description: 'The id of Paypal order you get when creating Paypal order' })
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
