import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { FileUpload } from 'graphql-upload';
import { User } from 'src/graphql';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtPayload } from '../auth/jwt/jwt-payload';
import { CommentDocument } from '../comment/comment.schema';
import { CommentService } from '../comment/comment.service';
import { MovieAttributeType } from '../movie-attribute/movie-attribute-type.enum';
import { MovieAttributeService } from '../movie-attribute/movie-attribute.service';
import { Language } from '../movie/enums/language.enum';
import { PartialDetailedMovie } from '../movie/types/partial-detailed-movie.type';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUsernameDto } from './dto/update-username.dto';
import { UserDocument } from './schema/user.schema';
import { UserService } from './user.service';

@Resolver('User')
export class UserResolver {
  public constructor(
    private readonly userService: UserService,
    private readonly commentService: CommentService,
    private readonly movieAttributeService: MovieAttributeService
  ) {}

  @Query()
  public me(@CurrentUser() user: JwtPayload): Promise<UserDocument> {
    return this.userService.findOne({ _id: user.id }, { tokens: false });
  }

  @Query()
  public user(@Args('id') id: string): Promise<UserDocument> {
    return this.userService.findOne({ _id: id }, { tokens: false });
  }

  @Mutation()
  public updatePassword(@Args('input') dto: UpdatePasswordDto, @CurrentUser() user: JwtPayload): Promise<void> {
    return this.userService.updatePassword(dto.oldPassword, dto.newPassword, user);
  }

  @Mutation()
  public updateUsername(@Args() dto: UpdateUsernameDto, @CurrentUser() user: JwtPayload): Promise<UserDocument> {
    return this.userService.updateUsername(dto.username, user);
  }

  @Mutation()
  public updateUser(@Args('user') dto: UpdateUserDto, @CurrentUser() user: JwtPayload): Promise<UserDocument> {
    return this.userService.updateUser(dto, user);
  }

  @Mutation()
  public upsertProfilPicture(@Args('image') image: FileUpload, @CurrentUser() user: JwtPayload): Promise<UserDocument> {
    return this.userService.changeProfilPicture(image, user.id);
  }

  @ResolveField()
  public comments(@Parent() user: User): Promise<CommentDocument[]> {
    return this.commentService.findManyByAuthor(user.id);
  }

  @ResolveField()
  public async favoriteMovies(
    @Parent() user: User,
    @Args('page') page: number,
    @Args('language') language?: Language
  ): Promise<PartialDetailedMovie[]> {
    return this.movieAttributeService.findMany(user.id, MovieAttributeType.isFavorite, page, language);
  }

  @ResolveField()
  public async watchedMovies(
    @Parent() user: User,
    @Args('page') page: number,
    @Args('language') language?: Language
  ): Promise<PartialDetailedMovie[]> {
    return this.movieAttributeService.findMany(user.id, MovieAttributeType.isWatched, page, language);
  }
}
