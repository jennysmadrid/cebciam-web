import { Injectable } from '@angular/core';
import { Actions, Effect, ofType, createEffect } from '@ngrx/effects';
import { asyncScheduler, Observable, of, from } from 'rxjs';
import { catchError, debounceTime, map, switchMap, tap, filter } from 'rxjs/operators';
import { Action } from '@ngrx/store';

import {
  MfaActionTypes,

  MfaEnroll,
  MfaEnrollSuccess,
  MfaEnrollError,

  MfaActivate,
  MfaActivateSuccess,
  MfaActivateError,

  MfaChallenge,
  MfaChallengeSuccess,
  MfaChallengeError,

  MfaVerifyChallenge,
  MfaVerifyChallengeSuccess,
  MfaVerifyChallengeError
} from '@app/mfa/store/actions/mfa.actions';

import { Router } from '@angular/router';

import { AuthService } from '@app/core/auth/services/auth.service';

import { HelperService } from '@app/core/services/helper/helper.service';

import { MfaService } from '@app/mfa/services/mfa.service';

import Swal from 'sweetalert2';

@Injectable()
export class MfaEffects {

  constructor(
    private actions$: Actions,
    private auth: AuthService,
    private helper: HelperService,
    private mfa: MfaService,
    private router: Router
  ) {}


  @Effect()
  enroll$ = ({ debounce = 300 } = {}): Observable<Action> =>
  this.actions$.pipe(
    ofType(MfaActionTypes.MFA_ENROLL),
    map( (action: MfaEnroll) => action.payload ),
    debounceTime(debounce),
    switchMap((payload: any) => {
      return this.mfa.mfaEnroll(payload).pipe(
        map((response: any) => {
          return new MfaEnrollSuccess(response);
        }),
        catchError((error: any) => {
          return of(new MfaEnrollError(error))
        })
      );
    })
  )

  @Effect({ dispatch: false })
  enrollError$ = (): Observable<any> =>
  this.actions$.pipe(
    ofType(MfaActionTypes.MFA_ENROLL_ERROR)
  );

  @Effect()
  activate$ = ({ debounce = 300 } = {}): Observable<Action> =>
  this.actions$.pipe(
    ofType(MfaActionTypes.MFA_ACTIVATE),
    map( (action: MfaActivate) => action.payload ),
    debounceTime(debounce),
    switchMap((payload: any) => {
      return this.mfa.mfaActivate(payload).pipe(
        map((response: any) => {
          return new MfaActivateSuccess(response);
        }),
        catchError((error: any) => of(new MfaActivateError(error)))
      )
    })
  )

  @Effect()
  challenge$ = ({ debounce = 300 } = {}): Observable<Action> =>
  this.actions$.pipe(
    ofType(MfaActionTypes.MFA_CHALLENGE),
    map( (action: MfaChallenge) => action.payload ),
    debounceTime(debounce),
    switchMap((payload) => {
      return this.mfa.mfaChallenge(payload).pipe(
        map((response: any) => {
          return new MfaChallengeSuccess(response);
        }),
        catchError((error: any) => of (new MfaChallengeError(error)))
      )
    })
  )

  @Effect()
  verify$ = ({ debounce = 300 } = {}): Observable<Action> =>
  this.actions$.pipe(
    ofType(MfaActionTypes.MFA_VERIFY_CHALLENGE),
    map( (action: MfaVerifyChallenge) => action.payload ),
    debounceTime(debounce),
    switchMap((payload) => {
      return this.mfa.mfaVerifyChallenge(payload).pipe(
        map((response: any) => {
          return new MfaVerifyChallengeSuccess(response);
        }),
        catchError((error: any) => of (new MfaVerifyChallengeError(error)))
      )
    })
  )

}
