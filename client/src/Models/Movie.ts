export interface Movie {
  tmdbId: number;
  title: string;
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  releaseDate: string;
  genres: string[];
  originalTitle: string;
  originalLanguage: string;
  popularity: number;
  voteCount: number;
  voteAverage: number;
  isFavorite: boolean;
  isWatched: boolean;
}
