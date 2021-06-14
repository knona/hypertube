import type { Comment } from './Comment';
import type { Movie } from './Movie';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  pictureUrl: string;
  comments: Comment[];
  favoriteMovies: Movie[];
  watchedMovies: Movie[];
}
