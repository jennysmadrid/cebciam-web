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

import { AuthService } from '@app/core/auth/services/auth.service';
import { HelperService } from '@app/core/services/helper/helper.service';

import Swal from 'sweetalert2';

import { SweetAlertService } from '@app/shared/services/sweet-alert.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {

  public currentUser: any;

  public changePasswordFormGroup: FormGroup;
  public changePasswordResponse$: Observable<any>;
  public destroy$ = new Subject();

  constructor(
    private store: Store<fromStore.UserState>,
    private router: Router,
    private auth: AuthService,
    private sweetAlert: SweetAlertService,
    private helper: HelperService
  ) {
    this.changePasswordResponse$ = this.store.select( fromStore.selectChangePasswordResponse );
  }

  ngOnInit(): void {

    this.currentUser = this.auth.getCurrentUser();

    this.changePasswordFormGroup = this.form();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  form() {
    return new FormGroup({
      oldPassword        : new FormControl(null, Validators.required),
      newPassword        : new FormControl(null, Validators.required),
      newPasswordConfirm : new FormControl(null, Validators.required),
    }, { updateOn: 'change' })
  }

  submit() {

    this.sweetAlert.toast('info', 'Processing..');

    const id      = this.currentUser.id;
    const payload = { ...this.changePasswordFormGroup.value, id };

    this.auth
        .changePassword(payload)
        .subscribe(
          data => {
            Swal.fire({
              backdrop          : false,
              allowOutsideClick : false,
              title             : `<b> Password Successfully Changed! </b>`,
              imageUrl          : 'assets/icons/svg/check-with-arrows.svg',
              showConfirmButton : false,
              showCloseButton   : true,
              onClose: () => {
                this.helper.removeAll();
                this.router.navigateByUrl('/login');
              }
            });
          },
          error => {
            if ( error.error ) {
              this.sweetAlert.toast('error', error.error.errorSummary);
            }
          }
        )
  }



}
