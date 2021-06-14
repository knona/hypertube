import type { Actor } from './Actor';
import type { Comment } from './Comment';
import type { Director } from './Director';
import type { Movie } from './Movie';
import type { Torrent } from './Torrent';
import type { YoutubeTrailer } from './YoutubeTrailer';

export interface DetailedMovie extends Movie {
  imdbId: string;
  budget: number;
  tagline: string;
  runtime: number;
  videos: YoutubeTrailer[];
  torrents: Torrent[];
  actors: Actor[];
  director: Director;
  comments: Comment[];
}
