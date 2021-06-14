export interface API42OAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  created_at: number;
}

export interface API42OAuthParams {
  grant_type: string;
  client_id: string;
  client_secret: string;
  code: string;
  redirect_uri: string;
}

export type API42MeResponse = {
  id: number;
  email: string;
  login: string;
  first_name: string;
  last_name: string;
  image_url: string;
} & Record<string, any>;

export interface UserInfos {
  id: number;
  email: string;
  login: string;
  firstName: string;
  lastName: string;
  pictureUrl: string;
}
