import { ApolloError } from 'apollo-server-errors';

export class AppException extends ApolloError {
  public constructor(message: string, details?: object) {
    super(message, undefined, details);

    Object.defineProperty(this, 'name', { value: 'AppException' });
  }
}
