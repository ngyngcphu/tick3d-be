import { Static, Type } from '@sinclair/typebox';

// See https://github.com/sinclairzx81/typebox

export const JoinedUserStatQuerystringDto = Type.Object({
    start: Type.String({ format: 'date', description: 'The start date of the interval' }),
    end: Type.String({ format: 'date', description: 'The end date of the interval' }),
    unit: Type.Union([Type.Literal('day'), Type.Literal('month')], {
        examples: ['day', 'month'],
        description: 'The unit used for `interval`',
        default: 'month'
    }),
    interval: Type.Number({ minimum: 1, multipleOf: 1, default: 1, description: 'The length of a sub-interval' })
});

export const UploadedModelStatQuerystringDto = Type.Object({
    start: Type.String({ format: 'date', description: 'The start date of the interval' }),
    end: Type.String({ format: 'date', description: 'The end date of the interval' }),
    unit: Type.Union([Type.Literal('day'), Type.Literal('month')], {
        examples: ['day', 'month'],
        description: 'The unit used for `interval`',
        default: 'month'
    }),
    interval: Type.Number({ minimum: 1, multipleOf: 1, default: 1, description: 'The length of a sub-interval' })
});

export const RevenueStatQuerystringDto = Type.Object({
    start: Type.String({ format: 'date', description: 'The start date of the interval' }),
    end: Type.String({ format: 'date', description: 'The end date of the interval' }),
    unit: Type.Union([Type.Literal('day'), Type.Literal('month')], {
        examples: ['day', 'month'],
        description: 'The unit used for `interval`',
        default: 'month'
    }),
    interval: Type.Number({ minimum: 1, multipleOf: 1, default: 1, description: 'The length of a sub-interval' })
});

export type RevenueStatQuerystringDto = Static<typeof RevenueStatQuerystringDto>;

export type UploadedModelStatQuerystringDto = Static<typeof UploadedModelStatQuerystringDto>;

export type JoinedUserStatQuerystringDto = Static<typeof JoinedUserStatQuerystringDto>;
