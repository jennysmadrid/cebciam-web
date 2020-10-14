import {
  Component,
  OnInit,
  AfterViewInit,
  AfterViewChecked,
  OnDestroy,
  ViewChildren,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';

import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router
} from '@angular/router';

import {
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import { Store } from '@ngrx/store';
import * as fromStore from '@app/mfa/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

import Swal from 'sweetalert2';
import { SwalPortalTargets, SwalComponent } from '@sweetalert2/ngx-sweetalert2';

import { AuthService } from '@app/core/auth/services/auth.service';
import { HelperService } from '@app/core/services/helper/helper.service';
import { MfaService } from '@app/mfa/services/mfa.service';
import { SweetAlertService } from '@app/shared/services/sweet-alert.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class VerificationComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {

  public alertConfirmLink = 'assets/icons/svg/alert-confirmation.svg';

  public verificationFormGroup: FormGroup;

  public currentUser: any;
  public currentFactors: any;
  public mobileFactor: any;
  public emailFactor: any = null;

  public challengeResponse$: Observable<any>;
  public verifyChallengeResponse$: Observable<any>;

  public destroy$ = new Subject();

  public verificationFactorId: any = null;

  public fromAction: string = null;
  public type: string;
  public isVerificationCodeSent = false;

  @ViewChild('ngOtpInput') ngOtpInputRef:any; // Get reference using ViewChild and the specified hash
  onOtpChange(event) {
    this.verificationFormGroup.get('passCode').patchValue(event);
  }

  @ViewChild('unregister') public unregisterSwal: SwalComponent;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private helper: HelperService,
    private mfa: MfaService,
    private sweetAlert: SweetAlertService,
    private store: Store<fromStore.MfaState>,
    private cdRef: ChangeDetectorRef,
    public readonly swalTargets: SwalPortalTargets
  ) {
    this.type                     = this.activatedRoute.snapshot.params.type;
    this.fromAction               = this.activatedRoute.snapshot.params['action-type'];
    this.challengeResponse$       = this.store.select( fromStore.selectMfaChallengeResponse );
    this.verifyChallengeResponse$ = this.store.select( fromStore.selectMfaVerifyChallengeResponse );
  }

  ngOnInit(): void {
    this.isVerificationCodeSent = false;
    this.currentUser    = this.auth.getCurrentUser();
    this.currentFactors = this.auth.getStoredUserFactors();

    if (!!this.currentFactors) {
      this.mobileFactor   = this.currentFactors.filter(factor => factor.factorType == 'sms' && factor.factorType !== undefined).shift();
      this.emailFactor    = this.currentFactors.filter(factor => factor.factorType == 'email' && factor.factorType !== undefined).shift();
    }

    this.verificationFormGroup = new FormGroup({
      passCode: new FormControl(null, Validators.required)
    }, { updateOn: 'change' });

  }

  ngAfterViewInit() {
  }

  ngAfterViewChecked() {
    // this.cdRef.detectChanges();
  }


  ngOnDestroy(): void {
    this.isVerificationCodeSent = false;
    this.destroy$.next();
    this.destroy$.complete();
  }

  sendCode(type?) {
    const payload = this.setupCodePayload(type);
    // this.store.dispatch( new fromStore.MfaChallenge(payload) );

    this.sweetAlert.toast('info', 'Processing..');

    this.mfa
        .mfaChallenge(payload)
        .pipe( takeUntil(this.destroy$) )
        .subscribe(response => {
          if ( response ) {
            this.sweetAlert.toast('success', 'Verification request has been sent!');
            this.isVerificationCodeSent = true;
          }
        });
  }

  submitCode(type?) {
    const code    = this.control('verificationFormGroup', 'passCode').value;
    const payload = this.setupCodePayload(type, code);

    // this.store.dispatch( new fromStore.MfaVerifyChallenge(payload) );

    this.mfa
        .mfaVerifyChallenge(payload)
        .subscribe(
          data => {
            if ( data ) {

              Swal.fire({
                backdrop          : false,
                allowOutsideClick : false,
                title             : `<b> Verified </b>`,
                imageUrl          : 'assets/icons/svg/check.svg',
                showConfirmButton : false,
                showCloseButton   : true,
                onClose           : () => {
                  this.isVerificationCodeSent = false;
                  if ( this.fromAction == 'edit-profile' ) {
                    this.router.navigateByUrl('/user/edit-profile');
                  } else if ( this.fromAction == 'change-password' ) {
                    this.router.navigateByUrl('/user/change-password');
                  } else if ( this.fromAction == 'unregister-password' ) {
                    this.unRegister();
                  }
                }
              });

            }
          },
          (error) => {
            if ( error && error.error ) {
              const summary = error.error.errorSummary;
              if ( summary == 'Invalid Passcode/Answer' ) {
                this.sweetAlert.toast('error', 'Incorrect code!');
              }
            }
          }
        );
  }

  setupCodePayload(type, code?) {
    let payload;
    if ( type == 'mobile' ) {
      payload = {
        userId    : this.currentUser.id,
        factorId  : this.mobileFactor.id,
        passCode  : code ? code : null
      };
    } else if ( type =='email' ) {
      payload = {
        userId    : this.currentUser.id,
        factorId  : this.emailFactor.id,
        passCode  : code ? code : null
      };
    }

    return payload;
  }

  control(formGroup, controlName: string): FormControl {
    return this[formGroup].get(controlName) as FormControl;
  }

  cancel() {
    window.history.back();
  }

  unRegister() {
    this.unregisterSwal.fire();
  }

  confirmUnregister() {

    this.auth
        .deactivateAccount(this.currentUser.id)
        .subscribe(response => {
          if ( response ) {
            this.auth
                .deleteAccount( this.currentUser.id )
                .subscribe(() => {
                  Swal.fire({
                    backdrop          : false,
                    allowOutsideClick : false,
                    title             : 'Your account has been deleted!',
                    imageUrl          : 'assets/icons/svg/check.svg',
                    text              : 'You will be redirected to login..',
                    showConfirmButton : false,
                    showCloseButton   : true,
                    onClose: () => {
                      this.helper.removeAll();
                      this.router.navigateByUrl('/login');
                    }
                  })
                })
              }
        })
  }

}
