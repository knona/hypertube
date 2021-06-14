import { gql } from 'graphql-request';
import type { RequestDocument } from 'graphql-request/dist/types';

export const UPDATE_PROFILE_PICTURE: RequestDocument = gql`
  mutation ($image: Upload!) {
    upsertProfilPicture(image: $image) {
      id
      firstName
      lastName
      username
      email
      pictureUrl
    }
  }
`;
