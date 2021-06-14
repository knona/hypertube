import { get, writable } from 'svelte/store';
import type { Comment } from '../../../Models/Comment';
import type { DetailedMovie } from '../../../Models/DetailedMovie';
import type { Optional } from '../../../Shared/Types';
import type { MovieStore } from './MovieStore.interface';

export function movieStore(): MovieStore {
  const store = writable<Optional<DetailedMovie>>(undefined);
  const { subscribe, update, set } = store;

  return {
    subscribe,
    update: (updatedMovie: (movie: DetailedMovie) => DetailedMovie) =>
      update((movie: Optional<DetailedMovie>) => (movie ? updatedMovie(movie) : movie)),
    setMovie: (movie: DetailedMovie) => set(movie),
    sortedComments: () =>
      get(store)?.comments.sort((c1, c2) => new Date(c2.createdAt).getTime() - new Date(c1.createdAt).getTime()) ?? [],
    addComment: (comment: Comment) =>
      update((movie: Optional<DetailedMovie>) =>
        movie ? { ...movie, comments: movie.comments.concat([comment]) } : undefined
      ),
    removeComment: (comment: Comment) =>
      update((movie: Optional<DetailedMovie>) =>
        movie ? { ...movie, comments: movie.comments.filter(c => c.id !== comment.id) } : undefined
      )
  };
}
