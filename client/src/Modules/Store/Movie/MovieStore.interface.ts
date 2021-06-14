import type { Subscriber, Unsubscriber } from 'svelte/store';
import type { Comment } from '../../../Models/Comment';
import type { DetailedMovie } from '../../../Models/DetailedMovie';
import type { Optional } from '../../../Shared/Types';

export interface MovieStore {
  subscribe: (this: void, run: Subscriber<Optional<DetailedMovie>>, invalidate?: any) => Unsubscriber;
  update: (updatedMovie: (movie: DetailedMovie) => DetailedMovie) => void;
  sortedComments: () => Comment[];
  setMovie: (movie: DetailedMovie) => void;
  addComment: (comment: Comment) => void;
  removeComment: (comment: Comment) => void;
}
