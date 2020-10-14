import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';

import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { tap, catchError, switchMap, filter, take, map  } from 'rxjs/operators';

import { AuthService } from '@app/core/auth/services/auth.service';
import { HelperService } from '@app/core/services/helper/helper.service';

import { environment } from '@env/environment';

import Swal from 'sweetalert2';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private auth: AuthService;

  private isTokenRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<any>(null);

  constructor(
    private injector: Injector,
    private helper: HelperService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    this.auth = this.injector.get(AuthService);

    const isAuthenticated = this.auth.isAuthenticated();

    if ( isAuthenticated ) {

      const token = this.auth.getAccessToken();
      const authRequest = this.attachToken(request, token);

      return next.handle(authRequest).pipe(
        tap(response => {
          if (response instanceof HttpResponse) {
            this.nullifyRequests();
          }
        }),
        catchError(error => {
          this.nullifyRequests();
          return this._processResponse(error, authRequest, next);
        })
      );

    } else {
      this._refreshToken(request, next);
      return next.handle(request);
    }

  }

  _processResponse(error: HttpErrorResponse, request, next: HttpHandler) {
    if ( error ) {
      if ( error.status === 401 ) {
        if ( error.error.fault ) {
          if (
              error.error.fault.detail.errorcode === environment.expired_access_token ||
              error.error.fault.detail.errorcode === environment.invalid_access_token ||
              error.error.fault.detail.errorcode === environment.oauth_v2_invalid_access_token
            ) {

            let timerInterval

            const errorToast = Swal.mixin({
              toast             : true,
              position          : 'top-end',
              showConfirmButton : false,
              timer             : 2000,
              timerProgressBar  : true,
              icon              : 'error',
              title             : 'Access token expired, refreshing...',
              onBeforeOpen: () => {
                timerInterval = setInterval(() => {}, 100)
              },
              onClose: () => {
                clearInterval(timerInterval)
              },
              onOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              }
            });
            errorToast
              .fire()
              .then((result) => {
                if (result.dismiss === Swal.DismissReason.timer) {
                  this._refreshToken(request, next);
                  window.location.reload();
                }
              });
          }
        }
      }
      return throwError(error);
    }
  }

  _refreshToken(request: HttpRequest<unknown>, next: HttpHandler) {

    if ( !this.isTokenRefreshing ) {

      this.isTokenRefreshing = true;
      this.refreshTokenSubject.next(null);

      this.auth.removeStoredAcessToken();

      return this.auth
          .postRequestAccessToken()
          .pipe( filter( (token: any) => token.accessToken != null ) )
          .subscribe(token => {
            this.isTokenRefreshing = false;
            this.refreshTokenSubject.next(token);
            this.auth.setAccessToken(token.accessToken.accessToken);
            return next.handle(this.attachToken(request, token.accessToken.accessToken));
          });
    }
    else {
      this.auth.removeStoredAcessToken();
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => {
          return next.handle(this.attachToken(request, token.accessToken.accessToken));
        })
      );
    }

  }

  private attachToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`,
        'Content-type' : 'application/json'
      }
    });
  }

  private nullifyRequests() {
    this.isTokenRefreshing = false;
    this.refreshTokenSubject.next(null);
  }

}
