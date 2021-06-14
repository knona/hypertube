import type { Token } from '../../Token';

export interface RefreshTokenResponse {
  refresh: {
    token: Token;
  };
}
