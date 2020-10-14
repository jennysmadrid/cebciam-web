import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  AfterViewChecked,
  ViewChildren,
  ElementRef,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';

import {
  Router,
  ActivatedRoute,
  ActivatedRouteSnapshot
} from '@angular/router';

import {
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import Swal from 'sweetalert2';

import { AuthService } from '@app/core/auth/services/auth.service';
import { MfaService } from '@app/mfa/services/mfa.service';
import { SweetAlertService } from '@app/shared/services/sweet-alert.service';

import { Store } from '@ngrx/store';
import * as fromStore from '@app/mfa/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.scss']
})
export class EnrollmentComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {

  @ViewChild('ngOtpInput') ngOtpInputRef:any;
  onOtpChange(value) {
    this.activationFormGroup.get('passCode').patchValue(value);
  }

  public currentUser: any;

  public activationFormGroup: FormGroup;
  public enrollmentFormGroup: FormGroup;

  public type: string;
  public isEnrollmentCodeSent = false;

  public enrollResponse$: Observable<any>;
  public enrollErrorResponse$: Observable<any>;
  public activateResponse$: Observable<any>;

  public destroy$ = new Subject();

  public activationFactorId: any = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private mfa: MfaService,
    private sweetAlert: SweetAlertService,
    private cdRef: ChangeDetectorRef,
    private store: Store<fromStore.MfaState>
  ) {
    this.type = this.activatedRoute.snapshot.params.type;
    this.enrollResponse$ = this.store.select( fromStore.selectMfaEnrollResponse );
    this.enrollErrorResponse$ = this.store.select( fromStore.selectMfaEnrollErrorResponse );
    this.activateResponse$ = this.store.select( fromStore.selectMfaActivateResponse );
  }

  ngOnInit(): void {

    this.isEnrollmentCodeSent = false;

    this.currentUser = this.auth.getCurrentUser();

    this.activationFormGroup = new FormGroup({
      'passCode': new FormControl(null, Validators.required)
    });

    this.enrollmentFormGroup = new FormGroup({
      'phoneNumber': new FormControl(null, Validators.required)
    }, { updateOn: 'change' });

  }

  ngAfterViewInit() {
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.isEnrollmentCodeSent = false;
    this.destroy$.next();
    this.destroy$.complete();
  }

  sendCode(type) {
    const payload = this.setupCodePayload(type);

    this.mfa.mfaEnroll(payload).subscribe(
      data => {
        if ( data ) {
          this.isEnrollmentCodeSent = true;
          this.activationFactorId = data.id;
        }
      },
      error => {
        if ( error && error.error ) {

          if (
              error.error.errorCauses &&
              error.error.errorCauses.filter(e => typeof e !== undefined).length > 0
          ) {

            const errorCauses = error.error.errorCauses;
            errorCauses.forEach(element => {
              this.sweetAlert.toast('error', element.errorSummary);
            });

          }
        }
      }
    );

  }

  resendCode(type) {
    this.sendCode(type);
    // const payload = this.setupCodePayload(type);
    // this.store.dispatch( new fromStore.MfaEnroll(payload) );
  }


  setupCodePayload(type) {
    let payload;
    if ( type == 'mobile' ) {
      const number = this.enrollmentFormGroup.get('phoneNumber').value;
      payload = {
        factorType : "sms",
        provider   : "OKTA",
        profile    : {
          phoneNumber: '+63' + number
        },
        id: this.currentUser.id
      };
    }
    return payload;
  }

  enroll(type: string) {
    //
  }

  submitCode(type) {
    const payload = {
      userId    : this.currentUser.id,
      factorId  : this.activationFactorId,
      passCode  : this.control('activationFormGroup', 'passCode').value
    };

    this.mfa
        .mfaActivate(payload)
        .pipe( takeUntil(this.destroy$) )
        .subscribe(
          data => {
            if ( data ) {
              this.mfa
                  .getUserFactorsList(payload.userId)
                  .pipe( takeUntil(this.destroy$) )
                  .subscribe(factors => {

                      if ( factors && factors.length > 0) {

                        this.isEnrollmentCodeSent = false;
                        this.auth.setCurrentUserFactors(factors);

                        Swal.fire({
                          backdrop          : false,
                          allowOutsideClick : false,
                          title             : `<b> Verified </b>`,
                          imageUrl          : 'assets/icons/svg/check.svg',
                          showConfirmButton : false,
                          showCloseButton   : true,
                          onClose           : () => this.router.navigateByUrl('/user/profile')
                        });
                      }

                    }
                  )
            }
          },
          error => {
            if ( error && error.error ) {
              const summary = error.error.errorSummary;
              if ( summary == 'Invalid Passcode/Answer' ) {
                this.sweetAlert.toast('error', 'Incorrect code!');
              }
            }
          }
        );

  }

  cancelVerification() {
    this.isEnrollmentCodeSent = false;
  }

  control(formGroup, controlName: string): FormControl {
    return this[formGroup].get(controlName) as FormControl;
  }

}
