import { Component, OnInit, ViewChildren, ViewChild, ChangeDetectorRef, AfterViewChecked, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { interval, Observable, timer, Subject, PartialObserver } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SwalPortalTargets } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertService } from '@app/shared/services/sweet-alert.service';
import Swal from 'sweetalert2';

import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import * as fromStore from '@app/core/auth/store';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})

export class OtpComponent implements OnInit {
  otp: string;
  showOtpComponent = true;

  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;

  public getGoFactorId;
  public getGoStateToken;
  public getGoPassCode;
  public getGoExpiresAt;
  public currentDate;
  public expiryDate;
  public hasError: boolean = false;
  public messageFormGroup: FormGroup;
  private otpCounter: number = 0;

  expiresAt = 0;
  time = 59;
  subscribeTimer: any;
  ispause = new Subject();
  timer: Observable<number>;
  timerObserver: PartialObserver<number>;

  title = 'One-Time Password';
  otpFormGroup: FormGroup;
  formInput = ['input1', 'input2', 'input3', 'input4', 'input5', 'input6'];

  @ViewChildren('formRow') rows: any;

  constructor(
    private toastr: ToastrService,
    private cd: ChangeDetectorRef,
    public readonly swalTargets: SwalPortalTargets,
    private sweetAlert: SweetAlertService,
    private dialog: MatDialog,
    private store: Store<fromStore.AuthState>,
    private userStore: Store<fromStore.UserState>,
    private http: HttpClient) { this.otpFormGroup = this.toFormGroup(this.formInput); }

  toFormGroup(elements) {
    const group: any = {};
    elements.forEach(key => {
      group[key] = new FormControl('', Validators.required);
    });
    return new FormGroup(group);
  }

  onKeyUp(event, index) {
    if (index < 5) {
      let elem: HTMLInputElement;
      let num = index + 2;
      elem = document.querySelector('#input' + num);
      elem.focus();
    }
  }

  verifyOtp() {
    this.sweetAlert.toast('info', 'Processing..');
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' }

    let passCode: string = '';
    for (let i = 1; i <= 6; i++) {
      passCode += this.otpFormGroup.get('input' + i).value;
    }

    let baseUrl = "https://apim-dev.gorewards.com.ph/api/profile/Okta/VerifyOTP?stateToken=" + this.getGoStateToken + "&factorId=" + this.getGoFactorId + "&passCode=" + passCode;
    this.http.post<any>(
      baseUrl, null, { headers }).subscribe(response => {
        this.getGoExpiresAt = response.data.expiresAt;

        if (response.message == "Success.") {
          Swal.fire({
            title: "Verified!",
            text: '',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'Ok',
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = '/';
            }
          })
        } else {
          console.log(response.data);
        }
      },
        error => {
          if (error.error.data == "E0000068") {            this.otpCounter += 1;            if (this.hasError = true) {              this.hasError = error.error.errorMessage;
            }            if (this.otpCounter >= 3) {              this.otpCounter = 0;              Swal.fire({
                title: 'Do you want to Resend an OTP?',
                text: 'You will receive a One-Time Password (OTP) on your email.',
                icon: 'error',
                showCancelButton: true,
                confirmButtonText: 'Resend OTP',
                cancelButtonText: 'Back to Login',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.resendOtp();
                } else if (result.isDismissed) {
                  window.location.href = '/';
                }
              })            }          } else if (error.error.data == "E0000069") { //User Locked
            Swal.fire({
              text: error.error.errorMessage,
              icon: 'error',
              showCancelButton: false,
              confirmButtonText: 'Ok'
            }).then((result) => {
              window.location.href = '/';
            })
          } else if (error.error.data == "E0000011") { //Invalid Token Provided
            Swal.fire({
              text: error.error.errorMessage,
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'Ok'
            }).then((result) => {
              window.location.href = '/';
            })
          }
        });
  }

  runOTPTimer() {
    let now = new Date;
    let newDate = new Date(this.getGoExpiresAt);

    this.currentDate = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
      now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());

    this.expiryDate = Date.UTC(newDate.getUTCFullYear(), newDate.getUTCMonth(), newDate.getUTCDate(),
      newDate.getUTCHours(), newDate.getUTCMinutes(), newDate.getUTCSeconds(), newDate.getUTCMilliseconds());

    this.expiresAt = (this.expiryDate - this.currentDate) / 1000;
  }

  resendOtp() {
    this.sweetAlert.toast('info', 'Processing..');
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' }

    let baseUrl = "https://apim-dev.gorewards.com.ph/api/profile/Okta/SendOTP?stateToken=" + this.getGoStateToken + "&factorId=" + this.getGoFactorId;
    this.http.post<any>(
      baseUrl, null, { headers }).subscribe(response => {
        if (response.message == "Success.") {
          console.log("Success");
          this.time = 59;
          this.expiresAt = (this.expiryDate - this.currentDate) / 1000;


        } else {
          console.log("Invalid Token Provided");
        }
      },
        error => {
          console.log(error.error.message);
        });
  }

  ngOnInit(): void {
    this.runOTPTimer();

    this.timer = interval(1000)
      .pipe(
        takeUntil(this.ispause)
      );

    this.timerObserver = {
      next: (_: number) => {
        if (this.time == 0) {
          this.ispause.next;
        }
        this.time -= 1;
        /*this.expiresAt -= 1;*/
      }
    };
    this.timer.subscribe(this.timerObserver);
  }


  secondsToHms(d) {
    d = Number(d);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    var mDisplay = m > 0 ? m + (m == 1 ? "m " : "m ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " " : "s") : "";
    return mDisplay + sDisplay;
  }

  otpExpiry(o) {
    o = Number(o);
    var m = Math.floor(o % 3600 / 60);
    var mDisplay = m > 0 ? m + (m == 1 ? " minutes " : " minutes ") : "";
    return mDisplay;
  }

  onSubmit() {
    this.otpFormGroup.reset();
  }

  setVal(val) {
    this.ngOtpInput.setValue(val);
  }
}
