import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { environment } from '@env/environment';
import { HelperService } from '@app/core/services/helper/helper.service';

@Injectable({
  providedIn: 'root'
})
export class MfaService {

  private url = {
    users: environment.baseUrl + '/users'
  }

  constructor(
    private http: HttpClient,
    private helper: HelperService
  ) { }

  mfaEnroll(payload): Observable<any> {
    const _url = this.url.users + `/${payload.id}/factors`;
    const _payload = {
      factorType  : payload.factorType,
      profile     : payload.profile,
      provider    : payload.provider
    };
    return this.http.post<any>(_url, _payload);
  }

  mfaActivate(payload): Observable<any> {
    const _url = this.url.users + `/${payload.userId}/factors/${payload.factorId}/lifecycle/activate`;
    return this.http.post<any>(_url, { 'passCode': payload.passCode });
  }

  mfaChallenge(payload: any): Observable<any> {
    const _url = this.url.users + `/${payload.userId}/factors/${payload.factorId}/verify`;
    return this.http.post<any>(_url, null);
  }

  mfaVerifyChallenge(payload: any): Observable<any> {
    const _url = this.url.users + `/${payload.userId}/factors/${payload.factorId}/verify`;
    return this.http.post<any>(_url, { 'passCode': payload.passCode });
  }

  getUserFactorsList(id): Observable<any> {
    const _url = this.url.users + `/${id}/factors`;
    return this.http.get<any>(_url);
  }


}
