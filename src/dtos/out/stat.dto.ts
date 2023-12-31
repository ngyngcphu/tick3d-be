import { Static, Type } from '@sinclair/typebox';

// See https://github.com/sinclairzx81/typebox

export const CategoryStatResultDto = Type.Array(
    Type.Object({
        count: Type.Number(),
        id: Type.String(),
        name: Type.String()
    })
);

export const JoinedUserStatResultDto = Type.Array(
    Type.Object({
        start: Type.String({ format: 'date' }),
        end: Type.String({ format: 'date' }),
        old: Type.Number(),
        new: Type.Number()
    })
);

export const UploadedModelStatResultDto = Type.Array(
    Type.Object({
        start: Type.String({ format: 'date' }),
        end: Type.String({ format: 'date' }),
        count: Type.Number()
    })
);

export const RevenueStatResultDto = Type.Array(
    Type.Object({
        start: Type.String({ format: 'date' }),
        end: Type.String({ format: 'date' }),
        total: Type.Number()
    })
);

export type RevenueStatResultDto = Static<typeof RevenueStatResultDto>;

export type UploadedModelStatResultDto = Static<typeof UploadedModelStatResultDto>;

export type JoinedUserStatResultDto = Static<typeof JoinedUserStatResultDto>;

export type CategoryStatResultDto = Static<typeof CategoryStatResultDto>;
