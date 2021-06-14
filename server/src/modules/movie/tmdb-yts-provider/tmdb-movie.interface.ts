import { TmdbGenre } from './tmdb-genres';

export interface TmdbMovie {
  poster_path: string | null;
  adult: boolean;
  overview: string;
  release_date: string;
  genre_ids: number[];
  id: number;
  original_title: string;
  original_language: string;
  title: string;
  backdrop_path: string | null;
  popularity: number;
  vote_count: number;
  video: boolean;
  vote_average: number;
}

export interface TmdbVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
}

export interface TmdbDetailedMovie {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: any | null;
  budget: number;
  genres: TmdbGenre[];
  homepage: string | null;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string | null;
  popularity: number;
  poster_path: string | null;
  production_companies: any[];
  production_countries: any[];
  release_date: string;
  runtime: number | null;
  spoken_languages: any[];
  status: string;
  tagline: string | null;
  title: string;
  videos?: { results: TmdbVideo[] | null };
  vote_average: number;
  vote_count: number;
}
