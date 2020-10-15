import { Injectable } from '@angular/core';
import { Actions, Effect, ofType, createEffect } from '@ngrx/effects';
import { asyncScheduler, Observable, of, from } from 'rxjs';
import { catchError, debounceTime, map, switchMap, tap, filter } from 'rxjs/operators';
import { Action } from '@ngrx/store';

import {
  AuthActionTypes,

  Register,
  RegisterSuccess,
  RegisterError,

  ActivateEmail,
  ActivateEmailSuccess,
  ActivateEmailError,

  Login,
  LoginSuccess,
  LoginError,

  Logout,
  LogoutError,

  ForgotPassword,
  ForgotPasswordSuccess,
  ForgotPasswordError
} from '@app/core/auth/store/actions/auth.actions';

import { Router } from '@angular/router';
import { AuthService } from '@app/core/auth/services/auth.service';

import { HelperService } from '@app/core/services/helper/helper.service';

import Swal from 'sweetalert2';

import { SweetAlertService } from '@app/shared/services/sweet-alert.service';

@Injectable()
export class AuthEffects {

  constructor(
    private actions$: Actions,
    private auth: AuthService,
    private helper: HelperService,
    private sweetAlert: SweetAlertService,
    private router: Router
  ) {}


  @Effect()
  register$ = ({ debounce = 300 } = {}): Observable<Action> =>
  this.actions$.pipe(
    ofType(AuthActionTypes.REGISTER),
    map( (action: Register) => action.payload ),
    debounceTime(debounce),
    switchMap((payload: any) => {
      return this.auth.register(payload).pipe(
        map((response: any) => new RegisterSuccess(response)),
        catchError((error: any) => of(new RegisterError(error)))
      );
    })
  )

  @Effect()
  activateEmail$ = ({ debounce = 300 } = {}): Observable<Action> =>
  this.actions$.pipe(
    ofType(AuthActionTypes.ACTIVATE_EMAIL),
    map( (action: ActivateEmail) => action.payload ),
    debounceTime(debounce),
    switchMap((payload: any) => {
      return this.auth.sendEmailActivation(payload).pipe(
        map((response: any) => new ActivateEmailSuccess(response) ),
        catchError((error: any) => of(new ActivateEmailError(error)))
      );
    })
  )

  @Effect({ dispatch: false })
  activateEmailError = (): Observable<any> =>
  this.actions$.pipe(
    ofType(AuthActionTypes.ACTIVATE_EMAIL_ERROR)
  );

  @Effect()
  login$ = ({ debounce = 300 } = {}): Observable<Action> =>
  this.actions$.pipe(
    ofType(AuthActionTypes.LOGIN),
    map( (action: Login) => action.payload ),
    debounceTime(debounce),
    switchMap( payload => {
      return this.auth.logIn(payload.username, payload.password).pipe(
        map((response: any) => {
          if ( response ) {
            const status = response.status;

            if ( status == 'SUCCESS' ) {
              return new LoginSuccess(response);
            } else if (status == 'LOCKED_OUT') {
              Swal.fire({
                backdrop          : false,
                allowOutsideClick : false,
                title             : `<b> Account locked! </b>`,
                imageUrl          : 'assets/icons/svg/lock-icon.svg',
                html              : 'Your account has been locked, please contact administrator',
                showConfirmButton : false,
                showCloseButton   : true,
                onClose: () => window.location.reload()
              });
            }
          }

          }),
        catchError((error: any) => of(new LoginError(error)))
      )
    })
  );

  @Effect({ dispatch: false })
  loginSuccess$ = (): Observable<any> =>
  this.actions$.pipe(
    ofType(AuthActionTypes.LOGIN_SUCCESS),
    tap(user => {
      if ( user.payload ) {

        const userClone = Object.assign({}, user.payload._embedded.user);
        delete userClone.passwordChanged;
        const id = userClone.id;

        this.auth.setCurrentUser(userClone);

        this.sweetAlert.toast('success', 'Logging in...');

        this.auth
            .getUserFactors(id)
            .pipe( filter(factors => factors.length > 0) )
            .subscribe(factors => {
              this.auth.setCurrentUserFactors(factors);
              if ( factors.length === 1 ) {
                this.router.navigateByUrl('/mfa/enrollment/mobile');
              } else if ( factors.length > 1) {
                this.router.navigateByUrl('/user/profile');
              }
              return true;
            });

      }
    })
  )

  @Effect({ dispatch: false })
  loginError = (): Observable<any> =>
  this.actions$.pipe(
    ofType(AuthActionTypes.LOGIN_ERROR)
  );

  @Effect({ dispatch: false })
  logOut$ = (): Observable<any> =>
  this.actions$.pipe(
    ofType(AuthActionTypes.LOGOUT),
    map( (action?: Logout) => action.payload ),
    switchMap( (payload: any) => {
      return this.auth.logOut().pipe(
        map( (response?: any) => {

          if ( response ) {

            this.sweetAlert.toast('success', 'Logging out...');
            this.helper.removeAll();
            this.router.navigateByUrl('/login');
            return true;
            // return new LogoutSuccess(response);
          }

        }),
        catchError((error: any) => of( new LogoutError(error)))
      );
    })
  )

  @Effect({ dispatch: false })
  logoutError = (): Observable<any> =>
  this.actions$.pipe(
    ofType(AuthActionTypes.LOGOUT_ERROR)
  );

  @Effect()
  forgotPassword$ = (): Observable<any> =>
  this.actions$.pipe(
    ofType(AuthActionTypes.FORGOT_PASSWORD),
    map( (action?: Logout) => action.payload ),
    switchMap( (payload: any) => {
      return this.auth.forgotPassword(payload).pipe(
        map( (response: any) => {

          if ( response ) {

            const email = payload.email;
            Swal.fire({
              backdrop          : false,
              allowOutsideClick : false,
              title             : `<b> Password Reset Request Sent </b>`,
              imageUrl          : 'assets/icons/svg/mail-sending.svg',
              html              :
                'We have sent a reset password link to <br>' +
                `<b> ${email} </b> <br> <br>` +
                `Didn't receive the e-mail yet? <br>` +
                'Please check your spam folder, <br>' +
                'or <span style="color: #18A7DF;"> resend </span> the e-mail.',
              showConfirmButton : false,
              showCloseButton   : true,
              onClose: () => this.router.navigateByUrl('/login')
            });

            return new ForgotPasswordSuccess(response);
          }
        }),
        catchError((error: any) => of( new ForgotPasswordError(error)))
      );
    })
  )


}
