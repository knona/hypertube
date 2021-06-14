import { gql } from 'graphql-request';
import type { RequestDocument } from 'graphql-request/dist/types';

export const UPDATE_PASSWORD: RequestDocument = gql`
  mutation ($oldPassword: String!, $newPassword: String!) {
    updatePassword(input: { oldPassword: $oldPassword, newPassword: $newPassword })
  }
`;
