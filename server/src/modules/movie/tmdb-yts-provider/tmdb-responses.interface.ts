import { TmdbMovie } from './tmdb-movie.interface';

export interface TmdbMoviesResponse {
  page: number;
  results: TmdbMovie[];
  total_results: number;
  total_pages: number;
}

export interface TmdbFindResponse {
  movie_results: TmdbMovie[];
}

export interface TmdbPerson {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  credit_id: string;
}

export interface TmdbCastPerson extends TmdbPerson {
  cast_id: number;
  character: string;
  order: number;
}

export interface TmdbCrewPerson extends TmdbPerson {
  department: string;
  job: string;
}

export interface TmdbCreditsResponse {
  id: number;
  cast: TmdbCastPerson[];
  crew: TmdbCrewPerson[];
}
