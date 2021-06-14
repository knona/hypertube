import { gql } from 'graphql-request';
import type { RequestDocument } from 'graphql-request/dist/types';

export const GENERATE_RESET_PASSWORD_TOKEN: RequestDocument = gql`
  mutation ($email: String!) {
    generateResetPasswordToken(email: $email)
  }
`;
