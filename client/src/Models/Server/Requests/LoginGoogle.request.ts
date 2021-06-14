import { gql } from 'graphql-request';
import type { RequestDocument } from 'graphql-request/dist/types';

export const LOGIN_GOOGLE: RequestDocument = gql`
  mutation ($code: String!) {
    loginGoogle(code: $code) {
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
