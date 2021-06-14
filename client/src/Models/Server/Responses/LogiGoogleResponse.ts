import type { Token } from '../../Token';
import type { User } from '../../User';

export interface LoginGoogleResponse {
  loginGoogle: {
    token: Token;
    user: User;
  };
}
