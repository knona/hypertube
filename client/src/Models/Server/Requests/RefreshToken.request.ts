import { gql } from 'graphql-request';
import type { RequestDocument } from 'graphql-request/dist/types';

export const REFRESH_TOKEN: RequestDocument = gql`
  mutation {
    refresh {
      token {
        token
        expiration
      }
    }
  }
`;
