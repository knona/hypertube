import { IsUsername } from 'src/shared/validators/is-username.validator';

export class UpdateUsernameDto {
  @IsUsername
  public username: string;
}
