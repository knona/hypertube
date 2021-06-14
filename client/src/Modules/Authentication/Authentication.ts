import { GENERATE_RESET_PASSWORD_TOKEN } from '../../Models/Server/Requests/GenerateResetPasswordToken.request';
import { GENERATE_VERIFICATION_TOKEN } from '../../Models/Server/Requests/GenerateVerificationToken.request';
import { LOGIN_42 } from '../../Models/Server/Requests/Login42.request';
import { LOGIN_EMAIL } from '../../Models/Server/Requests/LoginEmail.request';
import { LOGIN_GOOGLE } from '../../Models/Server/Requests/LoginGoogle.request';
import { RESET_PASSWORD } from '../../Models/Server/Requests/ResetPassword.request';
import { SIGNIN_EMAIL } from '../../Models/Server/Requests/SigninEmail.request';
import { UPDATE_EMAIL } from '../../Models/Server/Requests/UpdateEmail.request';
import { VERIFY_EMAIL } from '../../Models/Server/Requests/VerifyEmail.request';
import type { LoginGoogleResponse } from '../../Models/Server/Responses/LogiGoogleResponse';
import type { Login42Response } from '../../Models/Server/Responses/Login42Response';
import type { LoginResponse } from '../../Models/Server/Responses/LoginResponse';
import type { ResetPasswordResponse } from '../../Models/Server/Responses/ResetPasswordResponse';
import type { UpdateEmailResponse } from '../../Models/Server/Responses/UpdateEmailResponse';
import type { VerifyEmailResponse } from '../../Models/Server/Responses/VerifyEmailResponse';
import AppEvent from '../AppEvent/AppEvent';
import { Request } from '../Request/Request';
import { currentUserStore } from '../Store/CurrentUser/CurrentUserStore';
import { token } from '../Store/Token/TokenStore';

function logout(): void {
  currentUserStore.setUser(undefined);
  token.set(undefined);
  AppEvent.shouldLogout.next();
}

async function signinWithEmail(
  firstName: string,
  lastName: string,
  username: string,
  email: string,
  password: string
): Promise<void> {
  const request: Request = new Request(SIGNIN_EMAIL, {
    firstName: firstName,
    lastName: lastName,
    username: username,
    email: email,
    password: password
  });
  await request.perform();
}

async function loginWithEmail(login: string, password: string): Promise<void> {
  const request: Request = new Request(LOGIN_EMAIL, { identifier: login, password: password });
  const response: LoginResponse = await request.perform<LoginResponse>();
  currentUserStore.setUser(response.login.user);
  token.set(response.login.token);
}

async function loginWith42(code: string): Promise<void> {
  const request: Request = new Request(LOGIN_42, { code: code });
  const response: Login42Response = await request.perform<Login42Response>();
  currentUserStore.setUser(response.login42.user);
  token.set(response.login42.token);
}

async function loginWithGoogle(code: string): Promise<void> {
  const request: Request = new Request(LOGIN_GOOGLE, { code: code });
  const response: LoginGoogleResponse = await request.perform<LoginGoogleResponse>();
  currentUserStore.setUser(response.loginGoogle.user);
  token.set(response.loginGoogle.token);
}

async function verifyEmail(username: string, tokenString: string): Promise<void> {
  const request: Request = new Request(VERIFY_EMAIL, { username: username, token: tokenString });
  const response: VerifyEmailResponse = await request.perform<VerifyEmailResponse>();
  currentUserStore.setUser(response.verify.user);
  token.set(response.verify.token);
}

async function sendVerificationEmailBack(email: string): Promise<void> {
  const request: Request = new Request(GENERATE_VERIFICATION_TOKEN, { email: email });
  await request.perform();
}

async function sendResetPasswordEmail(email: string): Promise<void> {
  const request: Request = new Request(GENERATE_RESET_PASSWORD_TOKEN, { email: email });
  await request.perform();
}

async function resetPassword(username: string, tokenString: string, password: string): Promise<void> {
  const request: Request = new Request(RESET_PASSWORD, { username: username, token: tokenString, password: password });
  const response: ResetPasswordResponse = await request.perform<ResetPasswordResponse>();
  currentUserStore.setUser(response.resetPassword.user);
  token.set(response.resetPassword.token);
}

async function updateEmail(username: string, tokenString: string): Promise<void> {
  const request: Request = new Request(UPDATE_EMAIL, { username: username, token: tokenString });
  const response: UpdateEmailResponse = await request.perform<UpdateEmailResponse>();
  currentUserStore.setUser(response.updateEmail);
}

export default {
  logout,
  signinWithEmail,
  loginWithEmail,
  loginWith42,
  loginWithGoogle,
  verifyEmail,
  sendVerificationEmailBack,
  sendResetPasswordEmail,
  resetPassword,
  updateEmail
};
