import { Static, Type } from '@sinclair/typebox';

export const CreateOrderResultDto = Type.Object({
    id: Type.String(),
    totalPrice: Type.Number(),
    shippingFee: Type.Number(),
    deliTime: Type.String({ format: 'date' })
});

export type CreateOrderResultDto = Static<typeof CreateOrderResultDto>;
