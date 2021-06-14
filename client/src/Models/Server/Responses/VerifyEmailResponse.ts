import type { Token } from '../../Token';
import type { User } from '../../User';

export interface VerifyEmailResponse {
  verify: {
    token: Token;
    user: User;
  };
}
