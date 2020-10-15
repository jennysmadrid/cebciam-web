import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { authEffects, authReducers } from '@app/core/auth/store';

import { HelperService } from '@app/core/services/helper/helper.service';
import { AuthService } from '@app/core/auth/services/auth.service';
import { AuthGuard } from '@app/core/auth/services/auth.guard';

import { OktaAuthService } from '@app/core/auth/services/okta-auth.service';

import { AuthInterceptor } from '@app/core/interceptors/auth.interceptor';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,

    StoreModule.forFeature('auth', authReducers),
    EffectsModule.forFeature(authEffects)
  ],
  providers: [
    HelperService,
    AuthService,
    AuthGuard,
    OktaAuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class CoreModule {

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    if ( parentModule ) {
      throw new Error(this.msgModule());
    }
  }

  private msgModule(): string {
    return 'CoreModule is already loaded. Import only in AppModule';
  }
}
