import type { Movie } from '../../Models/Movie';
import { SEARCH } from '../../Models/Server/Requests/Search.request';
import type { SearchResponse } from '../../Models/Server/Responses/SearchResponse';
import { backLanguageForLanguage } from '../../Utils/LanguageUtils';
import { Request } from '../Request/Request';
import { token } from '../Store/Token/TokenStore';
import type { SearchFilters } from './Models/SearchFilters';

async function search(filters: SearchFilters, page: number, language: string): Promise<Movie[]> {
  const request: Request = new Request(SEARCH, {
    page: page,
    filters: filters,
    language: backLanguageForLanguage(language)
  });
  request.token = token.getString();
  const response: SearchResponse = await request.perform<SearchResponse>();
  return response.search;
}

export default {
  search
};
