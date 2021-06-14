import { IsString } from 'class-validator';
import { IsPassword } from 'src/shared/validators/is-password.validator';

export class ResetPasswordDto {
  @IsString()
  public username: string;

  @IsPassword
  public password: string;

  @IsString()
  public token: string;
}
