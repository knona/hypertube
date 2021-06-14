import { Movie } from 'src/graphql';
import { WithOptional } from 'src/shared/types/with-optional.type';

export type PartialMovie = WithOptional<Movie, 'isFavorite' | 'isWatched'>;
