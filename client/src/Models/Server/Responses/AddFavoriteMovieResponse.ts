import type { DetailedMovie } from '../../DetailedMovie';

export interface AddFavoriteMovieResponse {
  addFavoriteMovie: Partial<DetailedMovie>;
}
