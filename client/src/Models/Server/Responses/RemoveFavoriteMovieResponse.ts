import type { DetailedMovie } from '../../DetailedMovie';

export interface RemoveFavoriteMovieResponse {
  removeFavoriteMovie: Partial<DetailedMovie>;
}
