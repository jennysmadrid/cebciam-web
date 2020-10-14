import { Component, OnInit, OnDestroy } from '@angular/core';

import {
  FormGroup,
  FormControl,
  Validators,
  FormArray
} from '@angular/forms';

import { Observable, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromStore from '@app/core/auth/store';

import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { AuthService } from '@app/core/auth/services/auth.service';

import { SweetAlertService } from '@app/shared/services/sweet-alert.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {

  public forgotPasswordFormGroup: FormGroup;
  public forgotPasswordResponse$: Observable<any>
  public forgotPasswordErrorResponse$: Observable<any>
  public destroy$ = new Subject();

  constructor(
    private store: Store<fromStore.AuthState>,
    private auth: AuthService,
    private sweetAlert: SweetAlertService,
    private router: Router,
  ) {
    this.forgotPasswordErrorResponse$ = this.store.select( fromStore.selectForgotPasswordErrorResponse );
  }

  ngOnInit(): void {
    this.forgotPasswordFormGroup = this.form();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  form() {
    return new FormGroup({
      email  : new FormControl(null, Validators.required)
    }, { updateOn: 'change' })
  }

  submit() {

    this.sweetAlert.toast('info', 'Processing...');

    // const Toast = Swal.mixin({
    //   toast             : true,
    //   position          : 'top-end',
    //   showConfirmButton : false,
    //   timer             : 3000,
    //   timerProgressBar  : true,
    //   onOpen: (toast) => {
    //     toast.addEventListener('mouseenter', Swal.stopTimer)
    //     toast.addEventListener('mouseleave', Swal.resumeTimer)
    //   }
    // })

    // Toast.fire({
    //   icon  : 'info',
    //   title : 'Processing..'
    // });

    const payload = this.forgotPasswordFormGroup.value;

    this.auth
        .findUser(payload)
        .pipe(
          filter( response => response != null ),
          takeUntil( this.destroy$ ),
        )
        .subscribe( (response: any) => {
          if ( response ) {
            const _payload = {
              id    : response.id,
              email : response.profile.email
            };

            this.store.dispatch( new fromStore.ForgotPassword(_payload) );

            this.forgotPasswordErrorResponse$
                .subscribe(errorResponse => {
                  if ( errorResponse && errorResponse.error ) {

                    const errorCause = errorResponse.error.errorCauses[0];

                    this.sweetAlert.toast('error', errorCause.errorSummary);

                    // const errorToast = Swal.mixin({
                    //   toast             : true,
                    //   position          : 'top-end',
                    //   showConfirmButton : false,
                    //   timer             : 3000,
                    //   timerProgressBar  : true,
                    //   onOpen: (toast) => {
                    //     toast.addEventListener('mouseenter', Swal.stopTimer)
                    //     toast.addEventListener('mouseleave', Swal.resumeTimer)
                    //   }
                    // })

                    // errorToast.fire({
                    //   icon  : 'error',
                    //   title : errorCause.errorSummary
                    // });

                  }
                })
          }
        });
  }

}
