import { LoginInput } from 'src/graphql';

export class LoginDto implements LoginInput {
  public identifier: string;

  public password: string;
}
