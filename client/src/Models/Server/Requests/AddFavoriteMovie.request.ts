import { gql } from 'graphql-request';
import type { RequestDocument } from 'graphql-request/dist/types';

export const ADD_FAVORITE_MOVIE: RequestDocument = gql`
  mutation ($tmdbId: Int!) {
    addFavoriteMovie(tmdbId: $tmdbId) {
      isFavorite
    }
  }
`;
