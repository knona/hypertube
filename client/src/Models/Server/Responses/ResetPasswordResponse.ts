import type { Token } from '../../Token';
import type { User } from '../../User';

export interface ResetPasswordResponse {
  resetPassword: {
    token: Token;
    user: User;
  };
}
