import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';
import { OktaAuthService } from './okta-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  public isOktaAuthenticated: boolean = false;

  constructor(
    private auth: AuthService,
    private okta: OktaAuthService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    this.okta.isAuthenticated$.subscribe(value => this.isOktaAuthenticated = value );

    if ( !this.auth.getCurrentUser() ) {
      localStorage.clear();
      this.router.navigateByUrl('/login');
      return false;
    }
    return true;
  }

}
