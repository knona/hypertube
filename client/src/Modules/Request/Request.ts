import { GraphQLClient } from 'graphql-request';
import type { RequestDocument } from 'graphql-request/dist/types';
import type { ServerError } from '../../Models/Server/Errors/ServerError';
import { REFRESH_TOKEN } from '../../Models/Server/Requests/RefreshToken.request';
import type { RefreshTokenResponse } from '../../Models/Server/Responses/RefreshTokenResponse';
import type { Token } from '../../Models/Token';
import { graphqlUrl } from '../../Shared/Constants';
import type { Optional } from '../../Shared/Types';
import AppEvent from '../AppEvent/AppEvent';
import { token } from '../Store/Token/TokenStore';

export class Request {
  private authorizationToken: Optional<string>;
  public constructor(public query: RequestDocument, public variables?: any) {}

  public set token(value: string) {
    this.authorizationToken = value;
  }

  public perform<T>(): Promise<T> {
    const client: GraphQLClient = new GraphQLClient(graphqlUrl, {
      headers: {
        authorization: `Bearer ${this.authorizationToken ?? ''}`
      }
    });
    return new Promise<T>((resolve, reject) => {
      client
        .request<T>(this.query, this.variables)
        .then(resolve)
        .then(() => this.refreshTokenIfNeeded())
        .catch((data: { response: { errors: [ServerError] } }) => {
          if (!data?.response?.errors) {
            reject();
          } else if (this.containsTokenError(data.response.errors)) {
            AppEvent.shouldLogout.next();
          } else {
            reject(data.response.errors[0]);
          }
        });
    });
  }

  private refreshTokenIfNeeded(): Promise<void> {
    const currentToken: Optional<Token> = token.get();
    if (currentToken && currentToken.willExpireSoon) {
      const client: GraphQLClient = new GraphQLClient(graphqlUrl);
      return client
        .request<RefreshTokenResponse>(REFRESH_TOKEN)
        .then((response: RefreshTokenResponse) => token.set(response.refresh.token));
    }
    return Promise.resolve();
  }

  private containsTokenError(errors: [ServerError]): boolean {
    return errors.length > 0 && errors.some(error => error.extensions.code === 'UNAUTHENTICATED');
  }
}
