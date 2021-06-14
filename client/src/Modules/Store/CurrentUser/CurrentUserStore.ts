import { get, Writable, writable } from 'svelte/store';
import type { Comment } from '../../../Models/Comment';
import type { Movie } from '../../../Models/Movie';
import type { ServerError } from '../../../Models/Server/Errors/ServerError';
import type { User } from '../../../Models/User';
import { FAVORITE_MOVIES_PER_REQUEST, WATCHED_MOVIES_PER_REQUEST } from '../../../Shared/Constants';
import type { Optional } from '../../../Shared/Types';
import { LocalStorage } from '../../LocalStorage/LocalStorage';
import MovieManager from '../../Movie/MovieManager';
import { ComponentStateType } from '../ComponentState/Models/ComponentStateType';
import type { CurrentUserStore } from './CurrentUserStore.interface';
import type { CurrentUserStoreState } from './Models/CurrentUserStoreState';

function createUserStore(): CurrentUserStore {
  const storage: LocalStorage<User> = new LocalStorage('user');
  const initialState: CurrentUserStoreState = {
    user: storage.get(),
    favoriteMovies: {
      state: { current: ComponentStateType.default },
      page: 1,
      hasData: true
    },
    watchedMovies: {
      state: { current: ComponentStateType.default },
      page: 1,
      hasData: true
    }
  };
  const store = writable<CurrentUserStoreState>(initialState);
  const { subscribe, update, set } = store;
  subscribe((currentState: CurrentUserStoreState) => storage.set(currentState.user));

  return {
    subscribe,
    setUser: (user: Optional<User>): void => {
      set(
        user
          ? {
              ...initialState,
              user: user,
              favoriteMovies: {
                ...initialState.favoriteMovies,
                hasData: (user.favoriteMovies ?? []).length >= FAVORITE_MOVIES_PER_REQUEST
              },
              watchedMovies: {
                ...initialState.watchedMovies,
                hasData: (user.watchedMovies ?? []).length >= WATCHED_MOVIES_PER_REQUEST
              }
            }
          : { ...initialState, user: undefined }
      );
    },
    sortedComments: () =>
      get(store).user?.comments.sort((c1, c2) => new Date(c2.createdAt).getTime() - new Date(c1.createdAt).getTime()) ??
      [],
    deleteComment: (comment: Comment) => {
      update((state: CurrentUserStoreState) => ({
        ...state,
        user: state.user ? { ...state.user, comments: state.user.comments.filter(c => c.id !== comment.id) } : undefined
      }));
    },
    getFavoriteMovies: (language: string) => getFavoriteMovies(language, store),
    getWatchedMovies: (language: string) => getWatchedMovies(language, store),
    updateUser: (updatedUser: (user: User) => User) =>
      update((state: CurrentUserStoreState) => ({ ...state, user: state.user ? updatedUser(state.user) : undefined })),
    clear: () => set({ ...initialState, user: undefined })
  };
}

function getFavoriteMovies(language: string, store: Writable<CurrentUserStoreState>): void {
  const currentState: CurrentUserStoreState = get(store);
  if (!currentState.favoriteMovies.hasData) {
    return;
  }
  store.update((state: CurrentUserStoreState) => ({
    ...state,
    favoriteMovies: { ...state.favoriteMovies, state: { current: ComponentStateType.loading } }
  }));
  MovieManager.getFavoriteMoviesOfUserWithId(
    currentState.user?.id ?? '',
    currentState.favoriteMovies.page + 1,
    language
  )
    .then((fetchedMovies: Movie[]) => {
      if (fetchedMovies.length === 0) {
        store.update((state: CurrentUserStoreState) => ({
          ...state,
          favoriteMovies: {
            ...state.favoriteMovies,
            state: { current: ComponentStateType.default },
            hasData: false
          }
        }));
        return;
      }
      store.update((state: CurrentUserStoreState) => ({
        ...state,
        user: state.user
          ? { ...state.user, favoriteMovies: state.user.favoriteMovies.concat(fetchedMovies) }
          : undefined,
        favoriteMovies: {
          ...state.favoriteMovies,
          state: { current: ComponentStateType.default },
          page: state.favoriteMovies.page + 1,
          hasData: fetchedMovies.length >= 5
        }
      }));
    })
    .catch((error: ServerError) => {
      store.update((state: CurrentUserStoreState) => ({
        ...state,
        favoriteMovies: { ...state.favoriteMovies, state: { current: ComponentStateType.error, error: error } }
      }));
    });
}

function getWatchedMovies(language: string, store: Writable<CurrentUserStoreState>): void {
  const currentState: CurrentUserStoreState = get(store);
  if (!currentState.watchedMovies.hasData) {
    return;
  }
  store.update((state: CurrentUserStoreState) => ({
    ...state,
    watchedMovies: { ...state.watchedMovies, state: { current: ComponentStateType.loading } }
  }));
  MovieManager.getWatchedMoviesOfUserWithId(currentState.user?.id ?? '', currentState.watchedMovies.page + 1, language)
    .then((fetchedMovies: Movie[]) => {
      if (fetchedMovies.length === 0) {
        store.update((state: CurrentUserStoreState) => ({
          ...state,
          watchedMovies: {
            ...state.watchedMovies,
            state: { current: ComponentStateType.default },
            hasData: false
          }
        }));
        return;
      }
      store.update((state: CurrentUserStoreState) => ({
        ...state,
        user: state.user ? { ...state.user, watchedMovies: state.user.watchedMovies.concat(fetchedMovies) } : undefined,
        watchedMovies: {
          ...state.watchedMovies,
          state: { current: ComponentStateType.default },
          page: state.watchedMovies.page + 1,
          hasData: fetchedMovies.length >= 5
        }
      }));
    })
    .catch((error: ServerError) => {
      store.update((state: CurrentUserStoreState) => ({
        ...state,
        watchedMovies: { ...state.watchedMovies, state: { current: ComponentStateType.error, error: error } }
      }));
    });
}

export const currentUserStore: CurrentUserStore = createUserStore();
