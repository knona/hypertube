import { gql } from 'graphql-request';
import type { RequestDocument } from 'graphql-request/dist/types';

export const UPDATE_USER: RequestDocument = gql`
  mutation ($firstName: String!, $lastName: String!) {
    updateUser(user: { firstName: $firstName, lastName: $lastName }) {
      id
      firstName
      lastName
      username
      email
      pictureUrl
    }
  }
`;
