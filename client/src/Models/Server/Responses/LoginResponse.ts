import type { Token } from '../../Token';
import type { User } from '../../User';

export interface LoginResponse {
  login: {
    token: Token;
    user: User;
  };
}
