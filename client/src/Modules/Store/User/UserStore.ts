import { get, Writable, writable } from 'svelte/store';
import type { Comment } from '../../../Models/Comment';
import type { Movie } from '../../../Models/Movie';
import type { ServerError } from '../../../Models/Server/Errors/ServerError';
import type { User } from '../../../Models/User';
import { FAVORITE_MOVIES_PER_REQUEST } from '../../../Shared/Constants';
import type { Optional } from '../../../Shared/Types';
import MovieManager from '../../Movie/MovieManager';
import { ComponentStateType } from '../ComponentState/Models/ComponentStateType';
import type { UserStoreState } from './Models/UserStoreState';
import type { UserStore } from './UserStore.interface';

export function userStore(user: Optional<User> = undefined): UserStore {
  const initialState = {
    user: user,
    favoriteMovies: { state: { current: ComponentStateType.default }, page: 1, hasData: true }
  };
  const store = writable<UserStoreState>(initialState);
  const { subscribe, update, set } = store;

  return {
    subscribe,
    setUser: (newUser: User) =>
      set({
        ...initialState,
        user: newUser,
        favoriteMovies: {
          ...initialState.favoriteMovies,
          hasData: newUser.favoriteMovies.length >= FAVORITE_MOVIES_PER_REQUEST
        }
      }),
    sortedComments: () =>
      get(store).user?.comments.sort((c1, c2) => new Date(c2.createdAt).getTime() - new Date(c1.createdAt).getTime()) ??
      [],
    deleteComment: (comment: Comment) =>
      update((state: UserStoreState) => ({
        ...state,
        user: state.user ? { ...state.user, comments: state.user.comments.filter(c => c.id !== comment.id) } : undefined
      })),
    getFavoriteMovies: (language: string) => getFavoriteMovies(language, store)
  };
}

function getFavoriteMovies(language: string, store: Writable<UserStoreState>): void {
  const currentState: UserStoreState = get(store);
  if (!currentState.favoriteMovies.hasData) {
    return;
  }
  store.update((state: UserStoreState) => ({
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
        store.update((state: UserStoreState) => ({
          ...state,
          favoriteMovies: {
            ...state.favoriteMovies,
            state: { current: ComponentStateType.default },
            hasData: false
          }
        }));
        return;
      }
      store.update((state: UserStoreState) => ({
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
      store.update((state: UserStoreState) => ({
        ...state,
        favoriteMovies: { ...state.favoriteMovies, state: { current: ComponentStateType.error, error: error } }
      }));
    });
}
