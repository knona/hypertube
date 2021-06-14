import { get, writable } from 'svelte/store';
import { HomePageLayout } from '../../../Models/HomePageLayout';
import type { Movie } from '../../../Models/Movie';
import type { HomePageLayoutStore } from './HomePageLayoutStore.interface';

function createHomePageLayoutStore(): HomePageLayoutStore {
  const initialLayout: HomePageLayout = new HomePageLayout([]);
  const store = writable<HomePageLayout>(initialLayout);
  const { subscribe, set, update } = store;

  return {
    subscribe,
    set: (layout: HomePageLayout) => set(layout),
    getCurrentPage: () => get(store).page,
    getNextPage: () => get(store).page + 1,
    incrementPage: () => update((layout: HomePageLayout) => layout.incrementingPage()),
    addMovies: (movies: Movie[]) => update((layout: HomePageLayout) => layout.addingMovies(movies))
  };
}

export const popularHomePageLayout: HomePageLayoutStore = createHomePageLayoutStore();
export const topRatedHomePageLayout: HomePageLayoutStore = createHomePageLayoutStore();
