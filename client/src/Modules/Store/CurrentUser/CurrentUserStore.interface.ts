import type { Subscriber, Unsubscriber } from 'svelte/store';
import type { Comment } from '../../../Models/Comment';
import type { User } from '../../../Models/User';
import type { Optional } from '../../../Shared/Types';
import type { CurrentUserStoreState } from './Models/CurrentUserStoreState';

export interface CurrentUserStore {
  subscribe: (this: void, run: Subscriber<CurrentUserStoreState>, invalidate?: any) => Unsubscriber;
  setUser: (user: Optional<User>) => void;
  sortedComments: () => Comment[];
  deleteComment: (comment: Comment) => void;
  getFavoriteMovies: (language: string) => void;
  getWatchedMovies: (language: string) => void;
  updateUser: (updatedUser: (user: User) => User) => void;
  clear: () => void;
}
