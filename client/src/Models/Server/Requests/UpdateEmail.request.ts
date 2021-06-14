import { gql } from 'graphql-request';
import type { RequestDocument } from 'graphql-request/dist/types';

export const UPDATE_EMAIL: RequestDocument = gql`
  mutation ($username: String!, $token: String!) {
    updateEmail(username: $username, token: $token) {
      id
      firstName
      lastName
      username
      email
      pictureUrl
    }
  }
`;
