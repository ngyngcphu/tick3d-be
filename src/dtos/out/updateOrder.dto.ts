import { Status } from '@prisma/client';
import { Static, Type } from '@sinclair/typebox';

export const UpdateOrderResultDto = Type.Object({
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
});

export type UpdateOrderResultDto = Static<typeof UpdateOrderResultDto>;
