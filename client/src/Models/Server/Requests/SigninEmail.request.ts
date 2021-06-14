import { gql } from 'graphql-request';
import type { RequestDocument } from 'graphql-request/dist/types';

export const SIGNIN_EMAIL: RequestDocument = gql`
  mutation ($firstName: String!, $lastName: String!, $username: String!, $email: String!, $password: String!) {
    register(
      user: { firstName: $firstName, lastName: $lastName, username: $username, email: $email, password: $password }
    )
  }
`;
