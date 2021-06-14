import { gql } from 'graphql-request';
import type { RequestDocument } from 'graphql-request/dist/types';

export const UPDATE_USERNAME: RequestDocument = gql`
  mutation ($username: String!) {
    updateUsername(username: $username) {
      id
      firstName
      lastName
      username
      email
      pictureUrl
    }
  }
`;
