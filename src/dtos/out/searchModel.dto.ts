import { Static, Type } from '@sinclair/typebox';

export const SearchDefaultModelResultDto = Type.Array(
    Type.Object({
        id: Type.String(),
        name: Type.String()
    })
);

export type SearchDefaultModelResultDto = Static<typeof SearchDefaultModelResultDto>;
