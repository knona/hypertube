import { ME } from '../../Models/Server/Requests/Me.request';
import { USER } from '../../Models/Server/Requests/User.request';
import type { MeResponse } from '../../Models/Server/Responses/MeResponse';
import type { UserResponse } from '../../Models/Server/Responses/UserResponse';
import type { User } from '../../Models/User';
import { backLanguageForLanguage } from '../../Utils/LanguageUtils';
import { Request } from '../Request/Request';
import { currentUserStore } from '../Store/CurrentUser/CurrentUserStore';
import { token } from '../Store/Token/TokenStore';

async function getCurrentUser(language: string): Promise<void> {
  const request: Request = new Request(ME, { language: backLanguageForLanguage(language) });
  request.token = token.getString();
  const response: MeResponse = await request.perform<MeResponse>();
  currentUserStore.setUser(response.me);
}

async function getUserWithId(id: string, language: string): Promise<User> {
  const request: Request = new Request(USER, { id: id, language: backLanguageForLanguage(language) });
  request.token = token.getString();
  const response: UserResponse = await request.perform<UserResponse>();
  return response.user;
}

export default {
  getCurrentUser,
  getUserWithId
};
