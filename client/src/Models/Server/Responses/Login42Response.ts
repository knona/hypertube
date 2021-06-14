import type { Token } from '../../Token';
import type { User } from '../../User';

export interface Login42Response {
  login42: {
    token: Token;
    user: User;
  };
}
