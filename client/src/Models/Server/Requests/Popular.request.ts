import { gql } from 'graphql-request';
import type { RequestDocument } from 'graphql-request/dist/types';

export const POPULAR: RequestDocument = gql`
  query ($page: Int!, $language: Language!) {
    popular(page: $page, language: $language) {
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
      isWatched
    }
  }
`;
