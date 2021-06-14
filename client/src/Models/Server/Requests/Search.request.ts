import { gql } from 'graphql-request';
import type { RequestDocument } from 'graphql-request/dist/types';

export const SEARCH: RequestDocument = gql`
  query ($page: Int!, $filters: FiltersInput!, $language: Language!) {
    search(page: $page, filters: $filters, language: $language) {
      tmdbId
      title
      overview
      posterUrl
      backdropUrl
      releaseDate
      genres
      originalTitle
      originalLanguage
      popularity
      voteCount
      voteAverage
    }
  }
`;
