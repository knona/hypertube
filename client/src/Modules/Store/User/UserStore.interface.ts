import type { Subscriber, Unsubscriber } from 'svelte/store';
import type { Comment } from '../../../Models/Comment';
import type { User } from '../../../Models/User';
import type { UserStoreState } from './Models/UserStoreState';

export interface UserStore {
  subscribe: (this: void, run: Subscriber<UserStoreState>, invalidate?: any) => Unsubscriber;
  setUser: (user: User) => void;
  sortedComments: () => Comment[];
  deleteComment: (comment: Comment) => void;
  getFavoriteMovies: (language: string) => void;
}
