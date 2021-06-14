import { Inject } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { DetailedMovie, FiltersInput, FavoriteMovieAttribute, WatchedMovieAttribute } from 'src/graphql';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtPayload } from '../auth/jwt/jwt-payload';
import { Public } from '../auth/public.decorator';
import { CommentDocument } from '../comment/comment.schema';
import { CommentService } from '../comment/comment.service';
import { MovieAttributeType } from '../movie-attribute/movie-attribute-type.enum';
import { MovieAttributeService } from '../movie-attribute/movie-attribute.service';
import { Language } from './enums/language.enum';
import { MovieProvider } from './movie-provider';
import { PartialDetailedMovie } from './types/partial-detailed-movie.type';
import { PartialMovie } from './types/partial-movie.type';

export class MovieResolver {
  public constructor(
    @Inject('MovieProvider') private readonly movieProvider: MovieProvider,
    private readonly commentService: CommentService,
    private readonly movieAttributeService: MovieAttributeService
  ) {}

  @Query()
  @Resolver('Movie')
  @Public()
  public async popular(
    @Args('page') page: number,
    @Args('language') language?: Language,
    @CurrentUser() user?: JwtPayload
  ): Promise<PartialMovie[]> {
    const movies: PartialMovie[] = await this.movieProvider.popular(page, language);
    return this.movieAttributeService.populateMovies(user?.id, movies);
  }

  @Query()
  @Public()
  public async topRated(
    @Args('page') page: number,
    @Args('language') language?: Language,
    @CurrentUser() user?: JwtPayload
  ): Promise<PartialMovie[]> {
    const movies: PartialMovie[] = await this.movieProvider.topRated(page, language);
    return this.movieAttributeService.populateMovies(user?.id, movies);
  }

  @Query()
  @Resolver('Movie')
  public async recommendations(
    @Args('page') page: number,
    @Args('tmdbId') tmdbId: number,
    @Args('language') language?: Language,
    @CurrentUser() user?: JwtPayload
  ): Promise<PartialMovie[]> {
    const movies: PartialMovie[] = await this.movieProvider.recommendations(page, tmdbId, language);
    return this.movieAttributeService.populateMovies(user?.id, movies);
  }

  @Query()
  @Resolver('Movie')
  @Public()
  public async search(
    @Args('page') page: number,
    @Args('filters') filters: FiltersInput,
    @Args('language') language?: Language,
    @CurrentUser() user?: JwtPayload
  ): Promise<PartialMovie[]> {
    const movies: PartialMovie[] = await this.movieProvider.search(page, filters, language);
    return this.movieAttributeService.populateMovies(user?.id, movies);
  }

  @Query()
  @Resolver('Movie')
  public movie(@Args('tmdbId') tmdbId: number, @Args('language') language?: Language): Promise<PartialDetailedMovie> {
    return this.movieProvider.movie(tmdbId, language);
  }

  @Mutation()
  public async addFavoriteMovie(
    @Args('tmdbId') tmdbId: number,
    @CurrentUser() user: JwtPayload
  ): Promise<FavoriteMovieAttribute> {
    await this.movieAttributeService.create(user.id, tmdbId, MovieAttributeType.isFavorite);
    return { tmdbId, isFavorite: true };
  }

  @Mutation()
  public async removeFavoriteMovie(
    @Args('tmdbId') tmdbId: number,
    @CurrentUser() user: JwtPayload
  ): Promise<FavoriteMovieAttribute> {
    await this.movieAttributeService.delete(user.id, tmdbId);
    return { tmdbId, isFavorite: false };
  }

  @Mutation()
  public async addWatchedMovie(
    @Args('tmdbId') tmdbId: number,
    @CurrentUser() user: JwtPayload
  ): Promise<WatchedMovieAttribute> {
    await this.movieAttributeService.create(user.id, tmdbId, MovieAttributeType.isWatched);
    return { tmdbId, isWatched: true };
  }

  @Mutation()
  public async removeWatchedMovie(
    @Args('tmdbId') tmdbId: number,
    @CurrentUser() user: JwtPayload
  ): Promise<WatchedMovieAttribute> {
    await this.movieAttributeService.delete(user.id, tmdbId);
    return { tmdbId, isWatched: false };
  }

  @ResolveField()
  @Resolver('DetailedMovie')
  public comments(@Parent() movie: DetailedMovie): Promise<CommentDocument[]> {
    return this.commentService.findManyByMovie(movie.tmdbId);
  }

  @ResolveField('isFavorite')
  @Resolver('DetailedMovie')
  public async isFavoriteForDetailedMovie(
    @Parent() movie: DetailedMovie,
    @CurrentUser() user?: JwtPayload
  ): Promise<boolean> {
    return this.movieAttributeService.checkHasAttribute(user.id, movie.tmdbId, MovieAttributeType.isFavorite);
  }

  @ResolveField('isWatched')
  @Resolver('DetailedMovie')
  public async isWatchedForDetailedMovie(
    @Parent() movie: DetailedMovie,
    @CurrentUser() user?: JwtPayload
  ): Promise<boolean> {
    return this.movieAttributeService.checkHasAttribute(user.id, movie.tmdbId, MovieAttributeType.isWatched);
  }
}
