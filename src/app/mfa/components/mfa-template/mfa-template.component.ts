import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'app-mfa-template',
  templateUrl: './mfa-template.component.html',
  styleUrls: ['./mfa-template.component.scss']
})
export class MfaTemplateComponent implements OnInit {

  public fromAction: any = null;

  private verifyEmailIcon = 'assets/icons/svg/mail-colored.svg';
  private verifySmsIcon   = 'assets/icons/svg/sms-colored.svg';

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute
  ) {
    this.matIconRegistry.addSvgIcon(
      'verifyEmailIcon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(this.verifyEmailIcon)
    );

    this.matIconRegistry.addSvgIcon(
      'verifySmsIcon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(this.verifySmsIcon)
    );
    this.fromAction = this.activatedRoute.snapshot.params['action-type'];
  }

  ngOnInit(): void {
  }

}
