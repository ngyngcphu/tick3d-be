import { Status } from '@prisma/client';
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

export const OrderQueryStringDto = Type.Object({
    created_after: Type.Optional(
        Type.String({
            format: 'date-time',
            description: 'The time after which the order was created, specified in ISO format',
            examples: ['2023-12-18']
        })
    ),
    created_before: Type.Optional(
        Type.String({
            format: 'date-time',
            description: 'The time before which the order was created, specified in ISO format',
            examples: ['2023-12-25']
        })
    ),
    isPaid: Type.Optional(Type.Boolean({ description: 'Filter on paid statud' })),
    status: Type.Optional(
        Type.Union(
            Object.values(Status).map((e) => Type.Literal(e)),
            { description: 'Filter on order status' }
        )
    ),
    userId: Type.Optional(Type.String({ description: 'Filter on user id, only meaningful for managers' })),
    start: Type.Optional(
        Type.Number({ minimum: 0, multipleOf: 1, description: 'For pagination purpose - the index of the start item, starting at 0' })
    ),
    noItems: Type.Optional(
        Type.Number({ minimum: 1, multipleOf: 1, description: 'For pagination purpose - the number of items to return' })
    ),
    orderBy: Type.Optional(
        Type.Union([Type.Literal('totalPrice'), Type.Literal('shippingFee'), Type.Literal('creationTime')], {
            description: 'The name of the field to order on',
            examples: ['totalPrice', 'shippingFee', 'creationTime']
        })
    ),
    order: Type.Optional(
        Type.Union([Type.Literal('asc'), Type.Literal('desc')], { description: 'Sort ascending or descending', examples: ['asc', 'desc'] })
    )
});

export type OrderQueryStringDto = Static<typeof OrderQueryStringDto>;

export type CreateOrderInputDto = Static<typeof CreateOrderInputDto>;
