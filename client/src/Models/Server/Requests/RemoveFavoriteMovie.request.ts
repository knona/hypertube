import { gql } from 'graphql-request';
import type { RequestDocument } from 'graphql-request/dist/types';

export const REMOVE_FAVORITE_MOVIE: RequestDocument = gql`
  mutation ($tmdbId: Int!) {
    removeFavoriteMovie(tmdbId: $tmdbId) {
      isFavorite
    }
  }
`;
