import { IsString } from 'class-validator';
import { UpdatePasswordInput } from 'src/graphql';
import { IsPassword } from 'src/shared/validators/is-password.validator';

export class UpdatePasswordDto implements UpdatePasswordInput {
  @IsString()
  public oldPassword: string;

  @IsPassword
  public newPassword: string;
}
