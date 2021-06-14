import { gql } from 'graphql-request';
import type { RequestDocument } from 'graphql-request/dist/types';

export const ADD_WATCHED_MOVIE: RequestDocument = gql`
  mutation ($tmdbId: Int!) {
    addWatchedMovie(tmdbId: $tmdbId) {
      tmdbId
      isWatched
    }
  }
`;
