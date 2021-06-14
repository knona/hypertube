import { gql } from 'graphql-request';
import type { RequestDocument } from 'graphql-request/dist/types';

export const DELETE_COMMENT: RequestDocument = gql`
  mutation ($id: String!) {
    deleteComment(id: $id)
  }
`;
