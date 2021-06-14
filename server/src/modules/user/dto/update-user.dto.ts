import { UpdateUserInput } from 'src/graphql';
import { IsName } from 'src/shared/validators/is-name.validator';

export class UpdateUserDto implements UpdateUserInput {
  @IsName
  public firstName: string;

  @IsName
  public lastName: string;
}
