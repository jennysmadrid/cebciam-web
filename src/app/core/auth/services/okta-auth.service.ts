import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Observer } from 'rxjs';

import * as OktaAuthJs from '@okta/okta-auth-js';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class OktaAuthService {
  [x: string]: any;

  private url = {
    idps  : environment.baseUrl + '/idps',
    users : environment.baseUrl + '/users'
  };

  public oktaAuthClient;

  public config = {
    clientId      : environment.okta_client_id,
    redirectUri   : environment.okta_redirect_uri,
    issuer        : environment.okta_issuer_domain
  }

  public scopes = [
    'openid',
    'profile',
    'email'
  ];

  public isAuthenticated$: Observable<boolean>;
  private observer: Observer<boolean>;

  constructor(
    private http: HttpClient,
  ) {
    this.oktaAuthClient   = new OktaAuthJs(this.config);
    this.isAuthenticated$ = new Observable((observer: Observer<boolean>) => {
      this.observer = observer;
      this.isAuthenticated().then(val => observer.next(val) );
    });
  }

  init() {
    return this;
  }

  async isAuthenticated() {
    return !!(await this.oktaAuthClient.tokenManager.get('accessToken'));
  }

  loginWithGetGoPopup(type) {
    const idp = (type == 'getgo') ? environment.okta_getgo_idp : environment.okta_facebook_idp;

    return new Observable((observer: Observer<any>) => {
      this.oktaAuthClient
        .token
        .getWithPopup({
          scopes: this.scopes,
          idp: idp,
          pkce: true
        }).then(response => {
          observer.next(response);
        }).catch(error => of(false));
    });

  }

  loginWithPopup(type) {
    const idp = ( type == 'google' ) ? environment.okta_google_idp : environment.okta_facebook_idp;

    return new Observable((observer: Observer<any>) => {
      this.oktaAuthClient
          .token
          .getWithPopup({
            scopes  : this.scopes,
            idp     : idp,
            pkce    : true
          }).then(response => {
            observer.next(response);
          }).catch(error => of(false));
    });
  }

  async logout(accessToken?) {
    await this.oktaAuthClient.signOut({
      revokeAccessToken     : true,
      postLogoutRedirectUri : 'http://localhost:4200/'
    });
  }

  closeSession(userId): Observable<any> {
    const _url = this.url.users + `/${userId}/sessions`;
    return this.http.delete(_url);
  }

  async handleAuthentication() {

    if (await this.isAuthenticated()) {
    }

  }

  tokenManager() {
    return this.oktaAuthClient.tokenManager;
  }

  addToken(key: string, token) {
    return this.tokenManager().add(key, token);
  }

  getUserInfo(accessToken, idToken) {
    return this.oktaAuthClient.token.getUserInfo(accessToken, idToken);
  }

  verifyToken(idToken) {
    return this.oktaAuthClient.token.verify(idToken);
  }

  parseFromUrl() {
    return this.oktaAuthClient.token.parseFromUrl();
  }

  getUserFromIdp(idp, oktaUserId): Observable<any> {
    const _url = this.url.idps + `/${idp}/users/${oktaUserId}`;
    return this.http.get(_url);
  }

  getLinkedIdpsForUser(oktaUserId): Observable<any> {
    const _url = this.url.users + `/${oktaUserId}/idps`;
    return this.http.get(_url);
  }

  unlinkSocialAccount(idp, oktaUserId): Observable<any> {
    const _url = this.url.idps + `/${idp}/users/${oktaUserId}`;

    return this.http.delete(_url);
  }

}
