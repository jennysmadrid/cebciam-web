import { Injectable } from '@angular/core';
import { Actions, Effect, ofType, createEffect } from '@ngrx/effects';
import { asyncScheduler, Observable, of, from } from 'rxjs';
import { catchError, debounceTime, map, switchMap, tap } from 'rxjs/operators';
import { Action } from '@ngrx/store';

import {
  UserActionTypes,

  EditProfile,
  EditProfileSuccess,
  EditProfileError,

  ChangePassword,
  ChangePasswordSuccess,
  ChangePasswordError,

  DeactivateAccount,
  DeactivateAccountSuccess,
  DeactivateAccountError,

  DeleteAccount,
  DeleteAccountSuccess,
  DeleteAccountError
} from '@app/core/auth/store/actions/user.actions';

import { Router } from '@angular/router';
import { AuthService } from '@app/core/auth/services/auth.service';

import { HelperService } from '@app/core/services/helper/helper.service';

@Injectable()
export class UserEffects {

  constructor(
    private actions$: Actions,
    private auth: AuthService,
    private helper: HelperService,
    private router: Router
  ) {}

  @Effect()
  editProfile$ = ({ debounce = 300 } = {}): Observable<Action> =>
  this.actions$.pipe(
    ofType(UserActionTypes.EDIT_PROFILE),
    map( (action: EditProfile) => action.payload ),
    debounceTime(debounce),
    switchMap((payload: any) => {
      return this.auth.editProfile(payload).pipe(
        map((response: any) => new EditProfileSuccess(response) ),
        catchError((error: any) => of(new EditProfileError(error)) )
      );
    })
  )

  @Effect()
  changePassword$ = ({ debounce = 300 } = {}): Observable<Action> =>
  this.actions$.pipe(
    ofType(UserActionTypes.CHANGE_PASSWORD),
    map( (action: ChangePassword) => action.payload ),
    debounceTime(debounce),
    switchMap((payload: any) => {
      return this.auth.changePassword(payload).pipe(
        map((response: any) => new ChangePasswordSuccess(response) ),
        catchError((error: any) => of(new ChangePasswordError(error)) )
      );
    })
  )

  @Effect()
  deactivateAccount$ = ({ debounce = 300 } = {}): Observable<Action> =>
  this.actions$.pipe(
    ofType(UserActionTypes.DEACTIVATE_ACCOUNT),
    map( (action: DeactivateAccount) => action.payload ),
    debounceTime(debounce),
    switchMap((payload: any) => {
      return this.auth.deactivateAccount(payload).pipe(
        map((response: any) => {
          if ( response ) {
            return new DeactivateAccountSuccess(response) }
          }),
        catchError((error: any) => of(new DeactivateAccountError(error)) )
      );
    })
  )

  @Effect()
  deleteAccount$ = ({ debounce = 300 } = {}): Observable<Action> =>
  this.actions$.pipe(
    ofType(UserActionTypes.DELETE_ACCOUNT),
    map( (action: DeleteAccount) => action.payload ),
    debounceTime(debounce),
    switchMap((payload: any) => {
      return this.auth.deleteAccount(payload).pipe(
        map((response: any) => {
          return new DeleteAccountSuccess(response) }),
        catchError((error: any) => of(new DeleteAccountError(error)) )
      );
    })
  )

}
