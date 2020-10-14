import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild
} from '@angular/core';

import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

import { Observable, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromStore from '@app/core/auth/store';

import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { SwalPortalTargets, SwalComponent } from '@sweetalert2/ngx-sweetalert2';

import { AuthService } from '@app/core/auth/services/auth.service';
import { HelperService } from '@app/core/services/helper/helper.service';
import { OktaAuthService } from '@app/core/auth/services/okta-auth.service';
import { SweetAlertService } from '@app/shared/services/sweet-alert.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  @ViewChild('unregister') public unregisterSwal: SwalComponent;
  @ViewChild('logout') public logoutSwal: SwalComponent;
  @ViewChild('unlinkSocial') public unlinkSocialSwal: SwalComponent;

  public currentUser: any;
  public currentUserLinkedSocials: any = [];

  public deactivateResponse$: Observable<any>;
  public deleteResponse$: Observable<any>;
  public editProfileResponse$: Observable<any>;

  public destroy$ = new Subject();

  public unlinkAccountType = null;

  private lockIcon        = 'assets/icons/svg/lock-icon.svg';
  private doorIcon        = 'assets/icons/svg/door-icon.svg';
  private facebookIcon    = 'assets/icons/svg/facebook.svg';
  private googleIcon      = 'assets/icons/svg/google.svg';
  private linkedIcon      = 'assets/icons/svg/linked-icon.svg';
  public alertConfirmLink = 'assets/icons/svg/alert-confirmation.svg';

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private store: Store<fromStore.AuthState>,
    private auth: AuthService,
    private helper: HelperService,
    private okta: OktaAuthService,
    private sweetAlert: SweetAlertService,
    private router: Router,
    public readonly swalTargets: SwalPortalTargets
  ) {
    this.initIcons();
  }

  ngOnInit(): void {
    this.currentUser              = this.auth.getCurrentUser();
    this.currentUserLinkedSocials = this.auth.getCurrentUserLinkedSocials();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logOut() {
    this.logoutSwal.fire();
  }

  async confirmLogout() {
    const accessToken = await this.okta.tokenManager().get('accessToken');
    if (!!accessToken) {
      // this.okta.logout(accessToken);
      this.okta
          .closeSession(this.currentUser.id)
          .subscribe(() => {
            this.helper.removeAll();
            this.router.navigateByUrl('/login');
      });
    } else {
      return this.store.dispatch( new fromStore.Logout() );
    }

  }

  unlinkAccount(account: string) {
    const type = account.charAt(0).toUpperCase() + account.slice(1);
    this.unlinkAccountType = type;
    this.unlinkSocialSwal.fire();
  }

  confirmUnlink() {
    // const type = this.unlinkAccountType.toLowerCase();
    const type               = this.unlinkAccountType;
    const currentUserProfile = this.currentUser.profile;

    this.sweetAlert.toast('info', 'Processing..');

    if ( type === 'FACEBOOK' ) {
      if ( currentUserProfile.hasOwnProperty('FacebookID') ) {
        delete currentUserProfile.FacebookID;
      }
    }

    if ( type === 'GOOGLE' ) {
      if ( currentUserProfile.hasOwnProperty('GoogleID') ) {
        delete currentUserProfile.GoogleID;
      }
    }

    const payload = {
      id      : this.currentUser.id,
      profile : currentUserProfile
    };


    this.auth
        .editProfile(payload)
        .pipe(
          takeUntil(this.destroy$),
          filter(editResponse => editResponse != null)
        )
        .subscribe(editResponse => {

          const newUserData = {
            id      : editResponse.id,
            profile : editResponse.profile
          };

          this.auth.setCurrentUser(newUserData);

          const linkedSocial = this.auth.getCurrentUserLinkedSocials().filter(element => element.platform !== type);
          this.auth.setCurrentUserLinkedSocials(linkedSocial);

          Swal.fire({
            backdrop          : false,
            allowOutsideClick : false,
            title             : 'Successfully unlinked account!',
            imageUrl          : 'assets/icons/svg/check.svg',
            showConfirmButton : false,
            showCloseButton   : true,
            onClose: () => {
              window.location.reload();
            }
          });

        });
  }

  unRegister() {
    this.unregisterSwal.fire();
  }

  confirmUnregister() {
    // workaround
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
                });

              }

        });
  }

  initIcons() {
    this.matIconRegistry.addSvgIcon(
      'lockIcon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(this.lockIcon)
    );

    this.matIconRegistry.addSvgIcon(
      'doorIcon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(this.doorIcon)
    );

    this.matIconRegistry.addSvgIcon(
      'facebookIcon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(this.facebookIcon)
    );

    this.matIconRegistry.addSvgIcon(
      'googleIcon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(this.googleIcon)
    );

    this.matIconRegistry.addSvgIcon(
      'linkedIcon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(this.linkedIcon)
    );
  }

}
