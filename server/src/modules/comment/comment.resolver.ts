import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtPayload } from '../auth/jwt/jwt-payload';
import { CommentDocument } from './comment.schema';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Resolver('Comment')
export class CommentResolver {
  public constructor(private readonly commentservice: CommentService) {}

  @Mutation()
  public createComment(
    @CurrentUser() user: JwtPayload,
    @Args('input') dto: CreateCommentDto
  ): Promise<CommentDocument> {
    return this.commentservice.create(user.id, dto.tmdbId, dto.content);
  }

  @Mutation()
  public deleteComment(@CurrentUser() user: JwtPayload, @Args('id') commentId: string): Promise<void> {
    return this.commentservice.delete(user.id, commentId);
  }
}
