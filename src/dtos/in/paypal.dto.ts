import { Static, Type } from '@sinclair/typebox';
import { Status } from '@prisma/client';

// See https://github.com/sinclairzx81/typebox

export const CreatePayPalOrderDto = Type.Object(
    {
        intent: Type.String(),
        user_id: Type.String(),
        total_price: Type.Number(),
        shipping_fee: Type.Number(),
        est_deli_time: Type.String(),
        status: Type.Enum(Status),
        district: Type.String(),
        ward: Type.String(),
        street: Type.String(),
        streetNo: Type.String(),
        creation_time: Type.String(),
        isPaid: Type.Boolean(),
        extra_note: Type.String()
    },
    {
        examples: [
            {
                intent: 'CAPTURE',
                user_id: 'string',
                total_price: 45000,
                shipping_fee: 15000,
                est_deli_time: '2023-11-25T13:30:00',
                status: Status.ORDER_PENDING,
                district: 'string',
                ward: 'string',
                street: 'string',
                streetNo: 'string',
                creation_time: '2023-11-25T13:30:00',
                isPaid: false,
                extra_note: 'string'
            }
        ]
    }
);

export const CompletePayPalOrderDto = Type.Object(
    {
        intent: Type.String(),
        orderId: Type.String()
    },
    {
        examples: [
            {
                intent: 'CAPTURE',
                orderId: 'Order_id_is_in_result_of_create_order_api'
            }
        ]
    }
);

export type CreatePayPalOrderDto = Static<typeof CreatePayPalOrderDto>;
export type CompletePayPalOrderDto = Static<typeof CompletePayPalOrderDto>;
