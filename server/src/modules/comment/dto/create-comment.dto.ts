import { IsInt, IsString, MaxLength, MinLength } from 'class-validator';
import { CreateCommentInput } from 'src/graphql';

export class CreateCommentDto implements CreateCommentInput {
  @IsInt()
  public tmdbId: number;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  public content: string;
}
