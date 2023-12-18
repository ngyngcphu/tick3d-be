import { Static, Type } from '@sinclair/typebox';

export const SearchDefaultModelParamsDto = Type.Object({ keyword: Type.String() });

export type SearchDefaultModelParamsDto = Static<typeof SearchDefaultModelParamsDto>;
