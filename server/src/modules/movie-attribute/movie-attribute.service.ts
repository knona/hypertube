import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppException } from 'src/shared/exceptions/app-exception';
import { Language } from '../movie/enums/language.enum';
import { MovieProvider } from '../movie/movie-provider';
import { PartialDetailedMovie } from '../movie/types/partial-detailed-movie.type';
import { PartialMovie } from '../movie/types/partial-movie.type';
import { MovieAttributeType } from './movie-attribute-type.enum';
import { MovieAttributeDocument, MovieAttributeModel } from './movie-attribute.schema';

@Injectable()
export class MovieAttributeService {
  public constructor(
    @InjectModel(MovieAttributeModel.name) private readonly movieAttributeModel: Model<MovieAttributeDocument>,
    @Inject('MovieProvider') private readonly movieProvider: MovieProvider
  ) {}

  public async findMany(
    userId: string,
    type: MovieAttributeType,
    page: number,
    language?: Language
  ): Promise<PartialDetailedMovie[]> {
    const limit: number = 5;
    const skip: number = (page - 1) * limit;
    const movieAttributes: MovieAttributeDocument[] = await this.movieAttributeModel.find(
      { user: userId as any, type },
      null,
      { limit, skip, sort: { updatedAt: 'descending' } }
    );
    return Promise.all(movieAttributes.map(attribute => this.movieProvider.movie(attribute.tmdbId, language)));
  }

  public async create(userId: string, tmdbId: number, type: MovieAttributeType): Promise<MovieAttributeDocument> {
    return this.movieAttributeModel.findOneAndUpdate(
      { user: userId as any, tmdbId, type },
      {},
      { new: true, upsert: true }
    );
  }

  public async delete(userId: string, tmdbId: number): Promise<void> {
    const movieAttribute: MovieAttributeDocument = await this.movieAttributeModel.findOne({
      user: userId as any,
      tmdbId
    });
    if (!movieAttribute) {
      throw new AppException('MovieAttribute not found');
    }
    await this.movieAttributeModel.deleteOne({ _id: movieAttribute.id });
  }

  public async checkHasAttribute(userId: string, tmdbId: number, type: MovieAttributeType): Promise<boolean> {
    const count: number = await this.movieAttributeModel.countDocuments({ user: userId as any, tmdbId, type });
    return !!count;
  }

  private getAttributeMapFromAllAttributes(
    attributes: MovieAttributeDocument[],
    type: MovieAttributeType
  ): { [tmdbId: string]: true } {
    return attributes
      .filter(attribute => attribute.type === type)
      .reduce((acc, cur) => ({ ...acc, [cur.tmdbId]: true }), {});
  }

  public async populateMovies(userId: string | undefined, movies: PartialMovie[]): Promise<PartialMovie[]> {
    if (!userId) {
      return movies.map(movie => ({ ...movie, isFavorite: false, isWatched: false }));
    }
    const movieAttributes: MovieAttributeDocument[] = await this.movieAttributeModel.find({ user: userId as any });
    const favorites: { [tmdbId: string]: true } = this.getAttributeMapFromAllAttributes(
      movieAttributes,
      MovieAttributeType.isFavorite
    );
    const watched: { [tmdbId: string]: true } = this.getAttributeMapFromAllAttributes(
      movieAttributes,
      MovieAttributeType.isWatched
    );
    return movies.map(movie => ({
      ...movie,
      isFavorite: !!favorites[movie.tmdbId],
      isWatched: !!watched[movie.tmdbId]
    }));
  }
}
