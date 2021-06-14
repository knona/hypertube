import { GENERATE_EMAIL_UPDATE_TOKEN } from '../../Models/Server/Requests/GenerateEmailUpdateToken.request';
import { UPDATE_PASSWORD } from '../../Models/Server/Requests/UpdatePassword.request';
import { UPDATE_PROFILE_PICTURE } from '../../Models/Server/Requests/UpdateProfilePicture.request';
import { UPDATE_USER } from '../../Models/Server/Requests/UpdateUser.request';
import { UPDATE_USERNAME } from '../../Models/Server/Requests/UpdateUsername.request';
import type { UpdateProfilePictureResponse } from '../../Models/Server/Responses/UpdateProfilePictureResponse';
import type { UpdateUsernameResponse } from '../../Models/Server/Responses/UpdateUsernameResponse';
import type { UpdateUserResponse } from '../../Models/Server/Responses/UpdateUserResponse';
import type { User } from '../../Models/User';
import { Request } from '../Request/Request';
import { currentUserStore } from '../Store/CurrentUser/CurrentUserStore';
import { token } from '../Store/Token/TokenStore';

async function updateUser(firstName: string, lastName: string): Promise<void> {
  const request: Request = new Request(UPDATE_USER, { firstName: firstName, lastName: lastName });
  request.token = token.getString();
  const response: UpdateUserResponse = await request.perform<UpdateUserResponse>();
  currentUserStore.updateUser((user: User) => {
    return { ...user, firstName: response.updateUser.firstName, lastName: response.updateUser.lastName };
  });
}

async function updateUsername(username: string): Promise<void> {
  const request: Request = new Request(UPDATE_USERNAME, { username: username });
  request.token = token.getString();
  const response: UpdateUsernameResponse = await request.perform<UpdateUsernameResponse>();
  currentUserStore.updateUser((user: User) => {
    return { ...user, username: response.updateUsername.username };
  });
}

async function updatePassword(oldPassword: string, newPassword: string): Promise<void> {
  const request: Request = new Request(UPDATE_PASSWORD, {
    oldPassword: oldPassword,
    newPassword: newPassword
  });
  request.token = token.getString();
  await request.perform();
}

async function sendEmailUpdateEmail(email: string): Promise<void> {
  const request: Request = new Request(GENERATE_EMAIL_UPDATE_TOKEN, { email: email });
  request.token = token.getString();
  await request.perform();
}

async function updateProfilePicture(image: File): Promise<void> {
  const request: Request = new Request(UPDATE_PROFILE_PICTURE, { image: image });
  request.token = token.getString();
  const response: UpdateProfilePictureResponse = await request.perform<UpdateProfilePictureResponse>();
  currentUserStore.updateUser((user: User) => {
    return { ...user, pictureUrl: response.upsertProfilPicture.pictureUrl };
  });
}

export default {
  updateUser,
  updateUsername,
  sendEmailUpdateEmail,
  updatePassword,
  updateProfilePicture
};
