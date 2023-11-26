import { Static, Type } from '@sinclair/typebox';

export const CreateOrderResultDto = Type.Object({
    id: Type.String()
});

export type CreateOrderResultDto = Static<typeof CreateOrderResultDto>;
