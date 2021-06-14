import { gql } from 'graphql-request';
import type { RequestDocument } from 'graphql-request/dist/types';

export const RECOMMENDATIONS: RequestDocument = gql`
  query ($page: Int!, $tmdbId: Int!, $language: Language!) {
    recommendations(page: $page, tmdbId: $tmdbId, language: $language) {
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
