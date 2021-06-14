import type { MovieGenre } from '../../../Models/MovieGenre';
import type { SearchOrder } from './SearchOrder';
import type { SearchSort } from './SearchSort';

export interface SearchFilters {
  queryTerm: string;
  genre?: MovieGenre;
  minRating?: number;
  sortBy?: SearchSort;
  orderBy?: SearchOrder;
}
