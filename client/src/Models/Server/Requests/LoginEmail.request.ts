import { gql } from 'graphql-request';
import type { RequestDocument } from 'graphql-request/dist/types';

export const LOGIN_EMAIL: RequestDocument = gql`
  mutation ($identifier: String!, $password: String!) {
    login(credentials: { identifier: $identifier, password: $password }) {
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
