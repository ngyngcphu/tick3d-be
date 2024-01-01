import { Static, Type } from '@sinclair/typebox';

export const PaypalDto = Type.Object({
    id: Type.String(),
    totalPrice: Type.Number(),
    shippingFee: Type.Number(),
    deliTime: Type.String({ format: 'date' })
});

export const CompletePaypalDto = Type.Object({
    id: Type.String()
});

export type PaypalDto = Static<typeof PaypalDto>;
export type CompletePaypalDto = Static<typeof CompletePaypalDto>;
