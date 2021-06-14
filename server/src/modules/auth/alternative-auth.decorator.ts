import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const QUERY_PARAMS_TOKEN_KEY: string = 'token in query params';
export const QueryParamsToken: () => CustomDecorator = () => SetMetadata(QUERY_PARAMS_TOKEN_KEY, true);
