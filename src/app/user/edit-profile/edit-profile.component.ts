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
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit, OnDestroy {

  public editProfileFormGroup: FormGroup;
  public destroy$ = new Subject();

  public currentUser: any;

  constructor(
    private store: Store<fromStore.UserState>,
    private router: Router,
    private auth: AuthService,
    private sweetAlert: SweetAlertService
  ) { }

  ngOnInit(): void {
    this.currentUser          = this.auth.getCurrentUser();
    this.editProfileFormGroup = this.form(this.currentUser.profile);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  form(data) {
    return new FormGroup({
      firstName   : new FormControl(data.firstName, Validators.required),
      lastName    : new FormControl(data.lastName, Validators.required),
      email       : new FormControl(data.login, Validators.required),
      login       : new FormControl(data.login, Validators.required)
    }, { updateOn: 'change' })
  }

  submit() {
    const id      = this.currentUser.id;
    const payload = { profile: { ...this.editProfileFormGroup.value, id } };

    this.sweetAlert.toast('info', 'Processing...');

    this.auth
    .editProfile(payload)
    .pipe( takeUntil(this.destroy$) )
    .subscribe(updateResponse =>  {

      if ( updateResponse ) {
        const returnUpdate = {
          id        : updateResponse.id,
          profile   : updateResponse.profile
        };

        this.auth.setCurrentUser(returnUpdate);

        Swal.fire({
          backdrop          : false,
          allowOutsideClick : false,
          title             : `Profile has been updated!`,
          imageUrl          : 'assets/icons/svg/check.svg',
          showConfirmButton : false,
          showCloseButton   : true,
          onClose: () => {
            this.router.navigateByUrl('/user/profile');
          }
        });

      }

    });

  }

}
