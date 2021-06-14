import type { Subscriber, Unsubscriber } from 'svelte/store';
import type { HomePageLayout } from '../../../Models/HomePageLayout';
import type { Movie } from '../../../Models/Movie';

export interface HomePageLayoutStore {
  subscribe: (this: void, run: Subscriber<HomePageLayout>, invalidate?: any) => Unsubscriber;
  set: (layotu: HomePageLayout) => void;
  getCurrentPage: () => void;
  getNextPage: () => void;
  incrementPage: () => void;
  addMovies: (movies: Movie[]) => void;
}
