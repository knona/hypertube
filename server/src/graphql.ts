/*
 * ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

import { FileUpload } from 'graphql-upload';
import { MovieGenre } from './modules/movie/enums/movie-genre.enum';
import { MovieSort } from './modules/movie/enums/movie-sort.enum';
import { MovieSortOrder } from './modules/movie/enums/movie-sort-order.enum';
import { Language } from './modules/movie/enums/language.enum';

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginInput {
  identifier: string;
  password: string;
}

export interface CreateCommentInput {
  tmdbId: number;
  content: string;
}

export interface FiltersInput {
  queryTerm: string;
  genre?: MovieGenre;
  minRating?: number;
  sortBy?: MovieSort;
  orderBy?: MovieSortOrder;
}

export interface UpdatePasswordInput {
  oldPassword: string;
  newPassword: string;
}

export interface UpdateUserInput {
  firstName: string;
  lastName: string;
}

export interface LoginResponse {
  token: Token;
  user: User;
}

export interface IMutation {
  register(user: RegisterInput): Void | Promise<Void>;
  login(credentials: LoginInput): LoginResponse | Promise<LoginResponse>;
  login42(code: string): LoginResponse | Promise<LoginResponse>;
  loginGoogle(code: string): LoginResponse | Promise<LoginResponse>;
  refresh(): Token | Promise<Token>;
  generateVerificationToken(email: string): Void | Promise<Void>;
  generateResetPasswordToken(email: string): Void | Promise<Void>;
  generateEmailUpdateToken(email: string): Void | Promise<Void>;
  resetPassword(username: string, password: string, token: string): LoginResponse | Promise<LoginResponse>;
  verify(username: string, token: string): LoginResponse | Promise<LoginResponse>;
  updateEmail(username: string, token: string): User | Promise<User>;
  createComment(input: CreateCommentInput): Comment | Promise<Comment>;
  deleteComment(id: string): Void | Promise<Void>;
  addFavoriteMovie(tmdbId: number): FavoriteMovieAttribute | Promise<FavoriteMovieAttribute>;
  removeFavoriteMovie(tmdbId: number): FavoriteMovieAttribute | Promise<FavoriteMovieAttribute>;
  addWatchedMovie(tmdbId: number): WatchedMovieAttribute | Promise<WatchedMovieAttribute>;
  removeWatchedMovie(tmdbId: number): WatchedMovieAttribute | Promise<WatchedMovieAttribute>;
  updatePassword(input: UpdatePasswordInput): Void | Promise<Void>;
  updateUsername(username: string): User | Promise<User>;
  updateUser(user: UpdateUserInput): User | Promise<User>;
  upsertProfilPicture(image: Upload): User | Promise<User>;
}

export interface Comment {
  id: string;
  tmdbId: number;
  author: User;
  content: string;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface Movie {
  tmdbId: number;
  posterUrl?: string;
  backdropUrl?: string;
  overview: string;
  releaseDate: string;
  genres: string[];
  originalTitle: string;
  originalLanguage: string;
  title: string;
  popularity: number;
  voteCount: number;
  voteAverage: number;
  isFavorite: boolean;
  isWatched: boolean;
}

export interface YoutubeTrailer {
  key: string;
  name: string;
  size: number;
}

export interface Torrent {
  hash: string;
  quality: string;
  seeds: number;
  peers: number;
  size: string;
}

export interface Actor {
  name: string;
  popularity: number;
  profileUrl?: string;
  character: string;
}

export interface Director {
  name: string;
  popularity: number;
  profileUrl?: string;
}

export interface DetailedMovie {
  tmdbId: number;
  imdbId: string;
  budget: number;
  posterUrl?: string;
  backdropUrl?: string;
  overview?: string;
  releaseDate: string;
  genres: string[];
  originalTitle: string;
  originalLanguage: string;
  title: string;
  popularity: number;
  voteCount: number;
  voteAverage: number;
  tagline?: string;
  runtime?: number;
  videos: YoutubeTrailer[];
  torrents: Torrent[];
  actors: Actor[];
  director?: Director;
  comments: Comment[];
  isFavorite: boolean;
  isWatched: boolean;
}

export interface IQuery {
  popular(page: number, language?: Language): Movie[] | Promise<Movie[]>;
  topRated(page: number, language?: Language): Movie[] | Promise<Movie[]>;
  recommendations(page: number, tmdbId: number, language?: Language): Movie[] | Promise<Movie[]>;
  search(page: number, filters: FiltersInput, language?: Language): Movie[] | Promise<Movie[]>;
  movie(tmdbId: number, language?: Language): DetailedMovie | Promise<DetailedMovie>;
  me(): User | Promise<User>;
  user(id: string): User | Promise<User>;
}

export interface FavoriteMovieAttribute {
  tmdbId: number;
  isFavorite: boolean;
}

export interface WatchedMovieAttribute {
  tmdbId: number;
  isWatched: boolean;
}

export interface Token {
  token: string;
  expiration: DateTime;
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  pictureUrl?: string;
  comments: Comment[];
  favoriteMovies: DetailedMovie[];
  watchedMovies: DetailedMovie[];
  createdAt: DateTime;
  updatedAt: DateTime;
}

export type DateTime = Date;
export type Void = void;
export type Upload = FileUpload;
