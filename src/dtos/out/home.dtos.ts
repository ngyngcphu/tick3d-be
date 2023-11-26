import { Static, Type } from '@sinclair/typebox';

export const HomeSlideResultDto = Type.Array(
    Type.Object({
        src: Type.String({ format: 'uri' }),
        alt: Type.String()
    })
);

export type HomeSlideResultDto = Static<typeof HomeSlideResultDto>;
