import type { ServerErrorType } from './ServerErrorType';

export interface ServerError {
  message: string;
  extensions: {
    subCode: ServerErrorType;
    code: string;
  };
}
