import { IsEmail } from 'class-validator';
import { RegisterInput } from 'src/graphql';
import { IsName } from 'src/shared/validators/is-name.validator';
import { IsPassword } from 'src/shared/validators/is-password.validator';
import { IsUsername } from 'src/shared/validators/is-username.validator';

export class RegisterDto implements RegisterInput {
  @IsUsername
  public username: string;

  @IsEmail()
  public email: string;

  @IsPassword
  public password: string;

  @IsName
  public firstName: string;

  @IsName
  public lastName: string;
}
