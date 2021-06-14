import type { Movie } from '../../../../Models/Movie';

export interface InfiniteMovieListState {
  movies: Movie[];
  page: number;
  hasData: boolean;
}
