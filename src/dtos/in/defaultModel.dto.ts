import { Static, Type } from '@sinclair/typebox';

export const DefaultModelQueryStringDto = Type.Object({
    keyword: Type.Optional(Type.String({ description: 'The substring that the model name should contain' })),
    uploaded_after: Type.Optional(
        Type.String({
            format: 'date-time',
            description: 'The time after which the model was uploaded, specified in ISO format',
            examples: ['2023-12-18']
        })
    ),
    uploaded_before: Type.Optional(
        Type.String({
            format: 'date-time',
            description: 'The time before which the model was uploaded, specified in ISO format',
            examples: ['2023-12-25']
        })
    ),
    categoryId: Type.Optional(Type.String({ description: 'The category id' })),
    likes_ge: Type.Optional(Type.Number({ minimum: 0, description: 'The minimum threshold for number of likes' })),
    start: Type.Optional(
        Type.Number({ minimum: 1, multipleOf: 1, description: 'For pagination purpose - the index of the start item, starting at 1' })
    ),
    noItems: Type.Optional(
        Type.Number({ minimum: 1, multipleOf: 1, description: 'For pagination purpose - the number of items to return' })
    ),
    orderBy: Type.Optional(
        Type.Union([Type.Literal('likesNo'), Type.Literal('uploadedTime'), Type.Literal('price'), Type.Literal('name')], {
            description: 'The name of the field to order on',
            examples: ['likesNo', 'uploadedTime', 'price', 'name']
        })
    ),
    order: Type.Optional(
        Type.Union([Type.Literal('asc'), Type.Literal('desc')], { description: 'Sort ascending or descending', examples: ['asc', 'desc'] })
    )
});

export type DefaultModelQueryStringDto = Static<typeof DefaultModelQueryStringDto>;
