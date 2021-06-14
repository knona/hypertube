import { gql } from 'graphql-request';
import type { RequestDocument } from 'graphql-request/dist/types';

export const RESET_PASSWORD: RequestDocument = gql`
  mutation ($username: String!, $password: String!, $token: String!) {
    resetPassword(username: $username, password: $password, token: $token) {
      user {
        id
        firstName
        lastName
        username
        email
        pictureUrl
      }
      token {
        token
        expiration
      }
    }
  }
`;
