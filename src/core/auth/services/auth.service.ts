import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { environment } from '@env/environment';

import { HelperService } from '@app/core/services/helper/helper.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = {
    login: environment.baseUrl + '/authn',
    users: environment.baseUrl + '/users'
  };

  constructor(
    private http: HttpClient,
    private helper: HelperService
  ) { }

  postRequestAccessToken(): Observable<any> {
    const _auth    = 'Basic ' + btoa(environment.authUsername + ':' + environment.authPassword);
    const _headers = { Authorization: _auth };

    return this.http.post<any>(environment.accesTokenEndPoint, {}, { headers: _headers });
  }

  getAccessToken(): string {
    return this.helper.getItem(this.getAuthTokenKeyName());
  }

  setAccessToken(token) {
    return this.helper.setItem(this.getAuthTokenKeyName(), token);
  }

  setCurrentUser(user) {
    return this.helper.setItem(this.getAuthUserKeyName(), user);
  }

  getCurrentUser() {
    return this.helper.getItem(this.getAuthUserKeyName());
  }

  getStoredUserFactors() {
    return this.helper.getItem(this.getAuthFactorKeyName());
  }

  setCurrentUserFactors(factors) {
    return this.helper.setItem(this.getAuthFactorKeyName(), factors);
  }

  getAuthFactorKeyName() {
    return environment.auth_user_factors;
  }

  getAuthTokenKeyName() {
    return environment.auth_access_token;
  }

  getAuthUserKeyName() {
    return environment.auth_user_key;
  }

  isAuthenticated(): boolean {
    return (this.helper.getItem(environment.auth_access_token)) ? true : false
  }

  removeStoredAcessToken() {
    return this.helper.removeItem(environment.auth_access_token);
  }

  setCurrentUserLinkedSocials(socials) {
    return this.helper.setItem(this.getAuthLinkedSocialKeyName(), socials);
  }

  getAuthLinkedSocialKeyName() {
    return environment.okta_linked_socials_accounts;
  }

  getCurrentUserLinkedSocials() {
    return this.helper.getItem(this.getAuthLinkedSocialKeyName());
  }

  /* user requests here */

  logIn(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.url.login, { username, password });
  }

  logOut(payload?: any): Observable<any> {
    return of(true);
  }

  register(payload: any): Observable<any> {
    const _url = this.url.users + '?activate=false';
    return this.http.post<any>(_url, payload);
  }

  sendEmailActivation(id: string): Observable<any> {
    const _url = this.url.users + `/${id}` + '/lifecycle/activate?sendEmail=true';
    return this.http.post<any>(_url, {});
  }

  forgotPassword(payload): Observable<any> {
    const _url = this.url.users + `/${payload.id}/credentials/forgot_password?sendEmail=true`;
    return this.http.post<any>(_url, null);
  }

  changePassword(payload: any): Observable<any> {
    const _url = this.url.users + `/${payload.id}/credentials/change_password`;
    const _payload = {
      "oldPassword": { "value": payload.oldPassword },
      "newPassword": { "value": payload.newPassword }
    };

    return this.http.post<any>(_url, _payload);
  }

  editProfile(payload): Observable<any> {

    const _id = payload.profile.id || payload.id;
    const _url = this.url.users + `/${_id}`;
    const profile: any = Object.assign({}, payload.profile);

    if (profile.hasOwnProperty('id')) {
      delete profile.id;
    }

    const clone = { profile: { ...profile } };
    return this.http.put(_url, clone);
  }

  findUser(payload): Observable<any> {
    const email = payload.email || payload.profile.email;
    const _url = this.url.users + `/${email}`;
    return this.http.get(_url);
  }

  getUserFactors(id: string): Observable<any> {
    const _url = this.url.users + `/${id}/factors`;
    return this.http.get(_url);
  }

  deactivateAccount(id): Observable<any> {
    const _url = this.url.users + `/${id}/lifecycle/deactivate`;
    return this.http.post<any>(_url, null);
  }

  deleteAccount(id): Observable<any> {
    const _url = this.url.users + `/${id}`;
    return this.http.delete(_url);
  }
}
