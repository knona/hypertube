export function gapiLoad(): Promise<void> {
  return new Promise(resolve => gapi.load('auth2', resolve));
}

export type GapiAuth2AuthorizeResponse = Omit<gapi.auth2.AuthorizeResponse, 'error' | 'error_subtype'>;

export function gapiAuthorize(config: gapi.auth2.AuthorizeConfig): Promise<GapiAuth2AuthorizeResponse> {
  return new Promise((resolve, reject) => {
    gapi.auth2.authorize(config, ({ error, error_subtype, ...res }) => {
      if (error) {
        reject({ error, error_subtype });
      } else {
        resolve(res);
      }
    });
  });
}
