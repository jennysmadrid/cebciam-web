import { Component, OnInit, OnDestroy } from '@angular/core';

import {
  FormGroup,
  FormControl,
  Validators,
  FormArray
} from '@angular/forms';

import Swal from 'sweetalert2';

import { Observable, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromStore from '@app/core/auth/store';

import { Router } from '@angular/router';

import { AuthService } from '@app/core/auth/services/auth.service';

import { SweetAlertService } from '@app/shared/services/sweet-alert.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  public registerResponse$: Observable<any>;
  public activatedEmailResponse$: Observable<any>;

  public registerFormGroup: FormGroup;

  public destroy$ = new Subject();

  constructor(
    private store: Store<fromStore.AuthState>,
    private router: Router,
    private auth: AuthService,
    private sweetAlert: SweetAlertService,
  ) {
    this.registerResponse$       = this.store.select(fromStore.selectRegisterResponse);
    this.activatedEmailResponse$ = this.store.select(fromStore.selectEmailActivationResponse);
  }

  ngOnInit(): void {
    this.registerFormGroup = this.form();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  form() {
    return new FormGroup({
      firstName   : new FormControl(null, Validators.required),
      lastName    : new FormControl(null, Validators.required),
      email       : new FormControl(null, Validators.required)
    }, { updateOn: 'change' })
  }

  submit() {

    // const Toast = Swal.mixin({
    //   toast             : true,
    //   position          : 'top-end',
    //   showConfirmButton : false,
    //   timer             : 2000,
    //   timerProgressBar  : true,
    //   onOpen: (toast) => {
    //     toast.addEventListener('mouseenter', Swal.stopTimer)
    //     toast.addEventListener('mouseleave', Swal.resumeTimer)
    //   }
    // });

    const login   = this.registerFormGroup.get('email').value;
    const payload = { profile: { ...this.registerFormGroup.value, login } };

    this.auth
        .register(payload)
        .subscribe(
          data => {
            if ( data ) {
              const id = data.id;
              this.store.dispatch( new fromStore.ActivateEmail(id) );

              this.activatedEmailResponse$
                  .pipe(
                    takeUntil(this.destroy$),
                    filter(response => response != false)
                  )
                  .subscribe(response => {
                    Swal.fire({
                      backdrop          : false,
                      allowOutsideClick : false,
                      title             : `You're now registered!`,
                      imageUrl          : 'assets/icons/svg/check.svg',
                      html:
                        'Please check your e-mail <br>' +
                        'for confirmation',
                      showConfirmButton : false,
                      showCloseButton   : true,
                      onClose: () => this.router.navigateByUrl('/login')
                    })
                  });
            }
          },
          (error) => {
            if ( error && error.error ) {
              const summary = error.error.errorSummary;
              if ( summary == 'Api validation failed: login' ) {
                this.sweetAlert.toast('error', 'Email address already exists!');

                // Toast.fire({
                //   icon  : 'error',
                //   title : 'Email address already exists!'
                // });

              }
            }
          }
        );
  }
}
