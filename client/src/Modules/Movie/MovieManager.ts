import type { Movie } from '../../Models/Movie';
import { ADD_FAVORITE_MOVIE } from '../../Models/Server/Requests/AddFavoriteMovie.request';
import { MOVIE } from '../../Models/Server/Requests/Movie.request';
import { RECOMMENDATIONS } from '../../Models/Server/Requests/Recomendations.request';
import { REMOVE_FAVORITE_MOVIE } from '../../Models/Server/Requests/RemoveFavoriteMovie.request';
import type { MovieResponse } from '../../Models/Server/Responses/MovieResponse';
import type { RecommendationsResponse } from '../../Models/Server/Responses/RecommendationsResponse';
import { backLanguageForLanguage } from '../../Utils/LanguageUtils';
import { Request } from '../Request/Request';
import { token } from '../Store/Token/TokenStore';
import { ADD_WATCHED_MOVIE } from '../../Models/Server/Requests/AddWatchedMovie.request';
import type { AddWatchedMovieResponse } from '../../Models/Server/Responses/AddWatchedMovie.response';
import { USER_FAVORITE_MOVIES, USER_WATCHED_MOVIES } from '../../Models/Server/Requests/User.request';
import type { UserResponse } from '../../Models/Server/Responses/UserResponse';

async function getMovieWithId(tmdbId: string, language: string): Promise<Movie> {
  const request: Request = new Request(MOVIE, {
    tmdbId: parseInt(tmdbId),
    language: backLanguageForLanguage(language)
  });
  request.token = token.getString();
  const response: MovieResponse = await request.perform<MovieResponse>();
  return response.movie;
}

async function getMovieRecommendations(tmdbId: string, page: number, language: string): Promise<Movie[]> {
  const request: Request = new Request(RECOMMENDATIONS, {
    tmdbId: parseInt(tmdbId),
    page: page,
    language: backLanguageForLanguage(language)
  });
  request.token = token.getString();
  const response: RecommendationsResponse = await request.perform<RecommendationsResponse>();
  return response.recommendations;
}

async function addToFavorites(tmdbId: string): Promise<void> {
  const request: Request = new Request(ADD_FAVORITE_MOVIE, { tmdbId: parseInt(tmdbId) });
  request.token = token.getString();
  await request.perform();
}

async function removeFavorites(tmdbId: string): Promise<void> {
  const request: Request = new Request(REMOVE_FAVORITE_MOVIE, { tmdbId: parseInt(tmdbId) });
  request.token = token.getString();
  await request.perform();
}

async function setMovieAsWatched(tmdbId: number): Promise<{ tmdbId: number; isWatched: boolean }> {
  const request: Request = new Request(ADD_WATCHED_MOVIE, { tmdbId });
  request.token = token.getString();
  const response: AddWatchedMovieResponse = await request.perform<AddWatchedMovieResponse>();
  return response.addWatchedMovie;
}

async function getWatchedMoviesOfUserWithId(userId: string, page: number, language: string): Promise<Movie[]> {
  const request = new Request(USER_WATCHED_MOVIES, {
    id: userId,
    page: page,
    language: backLanguageForLanguage(language)
  });
  request.token = token.getString();
  const response: Partial<UserResponse> = await request.perform<Partial<UserResponse>>();
  return response.user?.watchedMovies ?? [];
}

async function getFavoriteMoviesOfUserWithId(userId: string, page: number, language: string): Promise<Movie[]> {
  const request = new Request(USER_FAVORITE_MOVIES, {
    id: userId,
    page: page,
    language: backLanguageForLanguage(language)
  });
  request.token = token.getString();
  const response: Partial<UserResponse> = await request.perform<Partial<UserResponse>>();
  return response.user?.favoriteMovies ?? [];
}

export default {
  getMovieWithId,
  getMovieRecommendations,
  addToFavorites,
  removeFavorites,
  setMovieAsWatched,
  getWatchedMoviesOfUserWithId,
  getFavoriteMoviesOfUserWithId
};
