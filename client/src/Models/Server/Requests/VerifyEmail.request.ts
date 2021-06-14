import { gql } from 'graphql-request';
import type { RequestDocument } from 'graphql-request/dist/types';

export const VERIFY_EMAIL: RequestDocument = gql`
  mutation ($username: String!, $token: String!) {
    verify(username: $username, token: $token) {
      user {
        id
        firstName
        lastName
        username
        email
        pictureUrl
        comments {
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
      token {
        token
        expiration
      }
    }
  }
`;
