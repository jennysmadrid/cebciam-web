import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import {
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';

import { Observable, Subject, of } from 'rxjs';
import { takeUntil, tap, catchError, switchMap, filter, take, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromStore from '@app/core/auth/store';

import { Router } from '@angular/router';
import { environment } from '@env/environment';

import { OktaAuthService } from '@app/core/auth/services/okta-auth.service';
import { AuthService } from '@app/core/auth/services/auth.service';

import Swal from 'sweetalert2';
import { SwalPortalTargets, SwalComponent } from '@sweetalert2/ngx-sweetalert2';

import { SweetAlertService } from '@app/shared/services/sweet-alert.service';
import { MessageComponent } from '../message/message.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit, OnDestroy {

  private google = 'assets/icons/svg/google.svg';
  private facebook = 'assets/icons/svg/facebook.svg';
  private getgo = 'assets/icons/svg/getgo.svg';

  private inputEmail = 'assets/icons/svg/mail-with-bg.svg';
  private inputPassword = 'assets/icons/svg/password-with-bg.svg';

  public loginFormGroup: FormGroup;
  public loginErrorResponse$: Observable<any>;

  public updateUserProfile$: Observable<any>;
  public destroy$ = new Subject();


  constructor(
    private dialog: MatDialog,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private store: Store<fromStore.AuthState>,
    private userStore: Store<fromStore.UserState>,
    private okta: OktaAuthService,
    private auth: AuthService,
    private sweetAlert: SweetAlertService,
    private router: Router,
    public readonly swalTargets: SwalPortalTargets,
  ) {
    this.initIcons();
  }

  ngOnInit(): void {
    this.loginFormGroup = this.form();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  form() {
    return new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    }, { updateOn: 'change' })
  }

  login() {

    this.sweetAlert.toast('info', 'Verifying Credentials');
    const payload: any = this.loginFormGroup.value;
    this.store.dispatch(new fromStore.Login(payload));

    this.loginErrorResponse$ = this.store.select(fromStore.selectLoginErrorResponseEntities);

    this.loginErrorResponse$
      .subscribe(errorResponse => {

        if (errorResponse && errorResponse.error) {
          this.sweetAlert.toast('error', errorResponse.error.errorSummary);
        }

      })
  }

  formControl(control): FormControl {
    return this.loginFormGroup.get(control) as FormControl;
  }

  initIcons() {
    this.matIconRegistry.addSvgIcon(
      'inputEmail',
      this.domSanitizer.bypassSecurityTrustResourceUrl(this.inputEmail)
    );

    this.matIconRegistry.addSvgIcon(
      'inputPassword',
      this.domSanitizer.bypassSecurityTrustResourceUrl(this.inputPassword)
    );

    this.matIconRegistry.addSvgIcon(
      'googleLogo',
      this.domSanitizer.bypassSecurityTrustResourceUrl(this.google)
    );

    this.matIconRegistry.addSvgIcon(
      'facebookLogo',
      this.domSanitizer.bypassSecurityTrustResourceUrl(this.facebook)
    );

    this.matIconRegistry.addSvgIcon(
      'getgoLogo',
      this.domSanitizer.bypassSecurityTrustResourceUrl(this.getgo)
    );
  }

  loginWithGetGoModal() {
    this.dialog.open(MessageComponent);
  }

  loginWithSocial(type) {

    this.okta
      .loginWithPopup(type)
      .pipe(filter(response => response != null))
      .subscribe(response => {

        const tokens = response.tokens;
        if (tokens.idToken) {
          this.okta.addToken('idToken', tokens.idToken);
        }

        if (tokens.accessToken) {
          this.okta.addToken('accessToken', tokens.accessToken);
        }

        if (tokens.accessToken && tokens.accessToken) {

          this.okta
            .getUserInfo(tokens.accessToken, tokens.idToken)
            .then((user: any) => {

              this.sweetAlert.toast('info', 'Verifying Credentials');

              const oktaUserId = user.sub;
              const loggedInUser: any = {
                id: oktaUserId,
                profile: {
                  firstName: user.given_name,
                  lastName: user.family_name,
                  displayName: user.name,
                  login: user.email || user.preferred_username,
                  email: user.email || '',
                  FacebookID: null,
                  GoogleID: null,
                  GetgoID: null
                }
              };

              this.okta
                .getLinkedIdpsForUser(oktaUserId)
                .subscribe(result => {

                  const socialAccounts = [];

                  result.forEach(element => {

                    const idpId = element.id;

                    if (element.status == 'ACTIVE') {

                      this.okta
                        .getUserFromIdp(idpId, oktaUserId)
                        .pipe(
                          takeUntil(this.destroy$),
                          filter(res => res != null)
                        )
                        .subscribe(res => {

                          if (element.type === 'FACEBOOK' && res.externalId !== null) {
                            loggedInUser.profile.FacebookID = res.externalId;
                            const facebook = {
                              platform: element.type,
                              profile: res.profile
                            };
                            socialAccounts.push(facebook);
                          }

                          if (element.type === 'GOOGLE' && res.externalId !== null) {
                            loggedInUser.profile.GoogleID = res.externalId;
                            const google = {
                              platform: element.type,
                              profile: res.profile
                            };
                            socialAccounts.push(google);
                          }

                          if (element.type === 'GETGO' && res.externalId !== null) {
                            loggedInUser.profile.GetgoID = res.externalId;
                            const getgo = {
                              platform: element.type,
                              profile: res.profile
                            };
                            socialAccounts.push(getgo);
                          }

                          if (socialAccounts.length > 0) {
                            this.auth.setCurrentUserLinkedSocials(socialAccounts);
                            this.auth.setCurrentUser(loggedInUser);

                            const updateProfilePayload = Object.assign({}, loggedInUser);

                            this.sweetAlert.toast('success', 'Logging in...');

                            this.auth
                              .editProfile(updateProfilePayload)
                              .pipe(takeUntil(this.destroy$))
                              .subscribe(updateResponse => {
                                setTimeout(() => {
                                  this.router.navigateByUrl('/user/profile');
                                }, 1000)
                              });
                          }


                        });

                    }


                  });

                });
              // getting this ready for future use
              // this.auth
              //     .getUserFactors(oktaUserId)
              //     // .pipe( filter( factors => factors.length > 0) )
              //     .subscribe(factors => {
              //       // this.auth.setCurrentUserFactors(factors);
              //       // if ( factors.length === 0 ) {
              //       //   this.router.navigateByUrl('/mfa/enrollment/mobile');
              //       // }
              //       // else if ( factors.length > 1 ) {
              //       //   this.router.navigateByUrl('/user/profile');
              //       // }
              //       // return true;
              // });
            })
            .catch(error => console.log(error));
        }

      });
  }

}
