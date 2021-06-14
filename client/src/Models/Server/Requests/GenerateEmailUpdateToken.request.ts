import { gql } from 'graphql-request';
import type { RequestDocument } from 'graphql-request/dist/types';

export const GENERATE_EMAIL_UPDATE_TOKEN: RequestDocument = gql`
  mutation ($email: String!) {
    generateEmailUpdateToken(email: $email)
  }
`;
