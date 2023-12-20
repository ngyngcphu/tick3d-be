import { Status } from '@prisma/client';
import { Static, Type } from '@sinclair/typebox';

export const OrderListResultDto = Type.Object({
    total: Type.Number({ minimum: 0 }),
    orders: Type.Array(
        Type.Object({
            id: Type.String(),
            userId: Type.String(),
            totalPrice: Type.Number(),
            shippingFee: Type.Number(),
            estimatedDeliveryTime: Type.String({ format: 'date-time' }),
            status: Type.Union(Object.values(Status).map((e) => Type.Literal(e))),
            district: Type.String(),
            ward: Type.String(),
            street: Type.String(),
            streetNo: Type.String(),
            creationTime: Type.String({ format: 'date-time' }),
            isPaid: Type.Boolean(),
            note: Type.Optional(Type.String()),
            digitalOrderId: Type.Optional(Type.String())
        })
    )
});

export type OrderListResultDto = Static<typeof OrderListResultDto>;
