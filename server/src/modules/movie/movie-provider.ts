import { FiltersInput } from 'src/graphql';
import { Language } from './enums/language.enum';
import { PartialDetailedMovie } from './types/partial-detailed-movie.type';
import { PartialMovie } from './types/partial-movie.type';

export interface MovieProvider {
  popular: (page: number, language?: Language) => Promise<PartialMovie[]>;
  topRated: (page: number, language?: Language) => Promise<PartialMovie[]>;
  search: (page: number, filters: FiltersInput, language?: Language) => Promise<PartialMovie[]>;
  recommendations: (page: number, tmdbId: number, language?: Language) => Promise<PartialMovie[]>;
  movie: (tmdbId: number, language?: Language) => Promise<PartialDetailedMovie>;
}
