const root_url = 'https://subdomain.yourdomain.com/okta-users';
const base_url = root_url + '/api/v1';

export const environment = {
  production: true,

  accesTokenEndPoint                  : 'https://subdomain.yourdomain.com/v1/oauth2/accessToken',
  baseUrl                             : base_url,

  authUsername                        : 'XXXXXXXXXXXX',
  authPassword                        : 'XXXXXXXXXXXX',

  auth_access_token                   : 'ciam_dev_token',
  auth_user_key                       : 'ciam_auth_user',
  auth_user_factors                   : 'ciam_auth_factors',

  expired_access_token                : 'keymanagement.service.access_token_expired',
  invalid_access_token                : 'keymanagement.service.invalid_access_token',
  oauth_v2_invalid_access_token       : 'oauth.v2.InvalidAccessToken',

  okta_client_id                      : 'XXXXXXXXXXXX',
  okta_issuer_domain                  : 'https://getgo-dev.oktapreview.com',

  okta_redirect_uri                   : 'http://localhost:4200/implicit/callback',
  okta_logout_redirect_uri            : 'http://localhost:4200',
  okta_end_session_redirect_uri       : 'com.oktapreview.getgo-dev:/',

  okta_discover_uri                   : 'https://getgo-dev.oktapreview.com',

  okta_linked_socials_accounts        : 'okta_linked_socials',

  okta_google_idp                     : 'XXXXXXXXXXXX',
  okta_facebook_idp                   : 'XXXXXXXXXXXX'
};
