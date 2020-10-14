import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CoreModule } from './core/core.module';
import { StaticModule } from './static/static.module';
import { SharedModule } from './shared';

import { HttpClientModule } from '@angular/common/http';

// ngrx
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';

import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

import { NgOtpInputModule } from 'ng-otp-input';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgOtpInputModule,

    CoreModule,
    StaticModule,
    SharedModule,

    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule.forRoot(),

    SweetAlert2Module.forRoot(),

    HttpClientModule,

    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-top-center',
      toastClass: 'toast-class',
      preventDuplicates: true
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
