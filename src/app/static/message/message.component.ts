import { Component, OnInit, Inject, Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subject, of, throwError } from 'rxjs';
import { Router, Data } from '@angular/router';

import { SwalPortalTargets } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertService } from '@app/shared/services/sweet-alert.service';
import Swal from 'sweetalert2';

import { ToastrService } from 'ngx-toastr';

import { Store } from '@ngrx/store';
import * as fromStore from '@app/core/auth/store';

import { OktaAuthService } from '@app/core/auth/services/okta-auth.service';
import { AuthService } from '@app/core/auth/services/auth.service';

import { OtpComponent } from '../otp/otp.component';

@Injectable({
  providedIn: 'root'
})

@Component({
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})

export class MessageComponent implements OnInit, OnDestroy {

  public getGoFactorId: "";
  public getGoStateToken: "";
  public getGoPassCode: "";

  public messageFormGroup: FormGroup;
  public getGoLoginErrorResponse$: Observable<any>;
  public destroy$ = new Subject();

  public hasError: boolean = false;

  hide = true;

  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private http: HttpClient,
    private sweetAlert: SweetAlertService,
    public readonly swalTargets: SwalPortalTargets,
    private router: Router,
    private auth: AuthService,
    private okta: OktaAuthService,
    private store: Store<fromStore.AuthState>,
    private userStore: Store<fromStore.UserState>,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<MessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.messageFormGroup = this.form();

    this.messageFormGroup = this.fb.group({
      username: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')]],
      password: ['', Validators.required]
    });
  }

  form() {
    return new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    }, { updateOn: 'change' })
  }

  formControl(control): FormControl {
    return this.messageFormGroup.get(control) as FormControl;
  }

  isValidInput(fieldName): boolean {
    return this.messageFormGroup.controls[fieldName].invalid &&
      (this.messageFormGroup.controls[fieldName].dirty || this.messageFormGroup.controls[fieldName].touched);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loginWithGetgo() {
    this.sweetAlert.toast('info', 'Verifying Credentials');
    const payload: any = this.messageFormGroup.value;
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' }

    this.store.dispatch(new fromStore.GetGoLogin(payload));
    this.getGoLoginErrorResponse$ = this.store.select(fromStore.selectGetGoLoginErrorResponseEntities);

    this.getGoLoginErrorResponse$
      .subscribe(errorResponse => {
        if (errorResponse && errorResponse.error) {
          this.sweetAlert.toast('error', errorResponse.error.errorSummary);
        }
    });


    let baseUrl = "https://apim-test.gorewards.com.ph/api/profile/Okta/Authentication?username=" + payload.username + "&password=" + payload.password;
    this.http.post<any>(
      baseUrl, null, { headers }).subscribe(response => {
        this.hasError = false;
        Swal.fire({
          title: "Status: " + response.data.status + "\nFactor ID: " + response.data.factorId + "\nState Token: " + response.data.stateToken,
          icon: 'success',
          confirmButtonText: 'Ok',
        }).then((result) => {
          if (result.isConfirmed) {
            OtpComponent;
          }
        });
        if (response.data.status == "MFA_CHALLENGE") {
          this.getGoFactorId = response.data.factorId;
          this.getGoStateToken = response.data.stateToken;
          this.getGoPassCode = response.data.passCode;

          let dialogRef = this.dialog.open(OtpComponent, {
            disableClose: true,
          });

          dialogRef.componentInstance.getGoFactorId = response.data.factorId;
          dialogRef.componentInstance.getGoStateToken = response.data.stateToken;
          dialogRef.componentInstance.getGoPassCode = response.data.passCode;
        } else {
          Swal.fire({
            title: '',
            text: "Okta ID: " + response.data.userId,
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'Ok',
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = '/';
            }
          })
        }
      },
      error => {
        //this.dialog.open(OtpComponent);
        //this.toastr.error(error.error.message);
        this.hasError = true;
      });
  }

  loginSubmit(): void {
    console.log(this.messageFormGroup.value);
  }
}
