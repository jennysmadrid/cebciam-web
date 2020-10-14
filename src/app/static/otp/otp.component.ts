import { Component, OnInit, ViewChildren, ViewChild, ChangeDetectorRef, AfterViewChecked, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
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
  config = {
    allowNumbersOnly: true,
    length: 5,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '50px',
      'height': '50px'
    }
  };

  public getGoFactorId;
  public getGoStateToken;
  public getGoPassCode;
  private otpCounter: number = 0;
  public hasError: boolean = false;

  time = 59;
  subscribeTimer: any;
  ispause = new Subject();
  timer: Observable<number>;
  timerObserver: PartialObserver<number>;
  title = 'otp';
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

  keyUpEvent(event, index) {
    let pos = index; 
    if (event.keyCode === 8 && event.which === 8) {
      pos = index - 1;
    } else {
      pos = index + 1;
    }
    if (pos > -1 && pos < this.formInput.length) {
      this.rows._results[pos].nativeElement.focus();
    }
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

    Swal.fire("Factor ID: " + this.getGoFactorId + "\nState Token: " + this.getGoStateToken + "\nPass Code: " + passCode);

    let baseUrl = "https://apim-dev.gorewards.com.ph/api/profile/Okta/VerifyOTP?stateToken=" + this.getGoStateToken + "&factorId=" + this.getGoFactorId + "&passCode=" + passCode;
    this.http.post<any>(
      baseUrl, null, { headers }).subscribe(response => {
        if (response.message == "Success.") {
          Swal.fire({
            title: "Okta ID: " + response.data.userId + "\nMember ID: " + response.data.memberId,
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
          console.log("Invalid Token Provided");
        }
      },
      error => {
        if (error.error.message.toLowerCase().indexOf('invalid passcode') !== -1) {          this.otpCounter += 1;          this.hasError = true;          if (this.otpCounter >= 3) {            this.otpCounter = 0;            Swal.fire({
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
            })          }        } else {
          Swal.fire({
            text: 'Your GetGo account is currently locked out. Try again after 60 minutes.',
            icon: 'error',
            showCancelButton: false,
            confirmButtonText: 'Ok'
          }).then((result) => {
             window.location.href = '/';
          })
        }
    });
  }

  resendOtp() {
    this.sweetAlert.toast('info', 'Processing..');
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' }

    Swal.fire("Factor ID: " + this.getGoFactorId + "\nState Token: " + this.getGoStateToken);

    let baseUrl = "https://apim-dev.gorewards.com.ph/api/profile/Okta/SendOTP?stateToken=" + this.getGoStateToken + "&factorId=" + this.getGoFactorId;
    this.http.post<any>(
      baseUrl, null, { headers }).subscribe(response => {
        if (response.message == "Success.") {
          console.log("Success");
        } else {
          console.log("Invalid Token Provided");
        }
      },
      error => {
        console.log(error.error.message);
    });
  } 

  ngOnInit(): void {
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
        }
      };
    this.timer.subscribe(this.timerObserver);
  }

  secondsToHms(d) {
    d = Number(d);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    var mDisplay = m > 0 ? m + (m == 1 ? ": " : " : ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? "" : "") : "0";
    return mDisplay + sDisplay;
  }

  onSubmit() {
    this.otpFormGroup.reset();
  }

  ngAfterViewChecked() {
    this.cd.detectChanges();
  }

  onOtpChange(otp) {
    this.otp = otp;
  }

  setVal(val) {
    this.ngOtpInput.setValue(val);
  }

  toggleDisable() {
    if (this.ngOtpInput.otpForm) {
      if (this.ngOtpInput.otpForm.disabled) {
        this.ngOtpInput.otpForm.enable();
      } else {
        this.ngOtpInput.otpForm.disable();
      }
    }
  }

  onConfigChange() {
    this.showOtpComponent = false;
    this.otp = null;
    setTimeout(() => {
      this.showOtpComponent = true;
    }, 0);
  }
}
