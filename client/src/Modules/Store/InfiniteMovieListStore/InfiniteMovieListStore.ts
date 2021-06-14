import { get, writable } from 'svelte/store';
import type { Movie } from '../../../Models/Movie';
import type { InfiniteMovieListState } from './Models/InfiniteMovieListState';

export function infiniteMovieList() {
  const initialState: InfiniteMovieListState = { movies: [], page: 1, hasData: true };
  const store = writable<InfiniteMovieListState>(initialState);
  const { subscribe, set, update } = store;

  return {
    subscribe,
    reset: () => set(initialState),
    setMovies: (movies: Movie[]) => update((state: InfiniteMovieListState) => ({ ...state, movies })),
    addMovies: (movies: Movie[]) =>
      update((state: InfiniteMovieListState) => ({ ...state, movies: state.movies.concat(movies) })),
    getCurrentPage: () => get(store).page,
    incrementPage: () => update((state: InfiniteMovieListState) => ({ ...state, page: state.page + 1 })),
    hasNoMoreData: () => update((state: InfiniteMovieListState) => ({ ...state, hasData: false }))
  };
}
