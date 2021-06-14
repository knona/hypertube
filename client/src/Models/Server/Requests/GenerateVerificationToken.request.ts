import { gql } from 'graphql-request';
import type { RequestDocument } from 'graphql-request/dist/types';

export const GENERATE_VERIFICATION_TOKEN: RequestDocument = gql`
  mutation ($email: String!) {
    generateVerificationToken(email: $email)
  }
`;
