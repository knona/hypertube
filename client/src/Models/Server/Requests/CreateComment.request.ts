import { gql } from 'graphql-request';
import type { RequestDocument } from 'graphql-request/dist/types';

export const CREATE_COMMENT: RequestDocument = gql`
  mutation ($tmdbId: Int!, $content: String!) {
    createComment(input: { tmdbId: $tmdbId, content: $content }) {
      id
      tmdbId
      author {
        id
        firstName
        lastName
        username
        email
        pictureUrl
      }
      content
      createdAt
      updatedAt
    }
  }
`;
