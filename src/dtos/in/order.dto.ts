import { Static, Type } from '@sinclair/typebox';

export const CreateOrderInputDto = Type.Object(
    {
        total_price: Type.Number(),
        shipping_fee: Type.Number(),
        est_deli_time: Type.String(),
        district: Type.String(),
        ward: Type.String(),
        street: Type.String(),
        streetNo: Type.String(),
        extra_note: Type.String()
    },
    {
        examples: [
            {
                total_price: 45000,
                shipping_fee: 15000,
                est_deli_time: '2023-11-25T13:30:00',
                district: 'string',
                ward: 'string',
                street: 'string',
                streetNo: 'string',
                isPaid: false,
                extra_note: 'string'
            }
        ]
    }
);

export type CreateOrderInputDto = Static<typeof CreateOrderInputDto>;
