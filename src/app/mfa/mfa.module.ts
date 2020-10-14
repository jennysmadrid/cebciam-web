import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { mfaReducers, mfaEffects } from '@app/mfa/store';

// Sweet Alert
import Swal from 'sweetalert2';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

// material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';

import { MfaRoutingModule } from './mfa-routing.module';
import { MfaTemplateComponent } from './components/mfa-template/mfa-template.component';
import { EnrollmentComponent } from './components/enrollment/enrollment.component';
import { VerificationComponent } from './components/verification/verification.component';

import { NgOtpInputModule  } from 'ng-otp-input';

import { MfaService } from '@app/mfa/services/mfa.service';

import { SharedModule } from '@app/shared';

@NgModule({
  declarations: [
    MfaTemplateComponent,
    EnrollmentComponent,
    VerificationComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MfaRoutingModule,

    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatListModule,

    NgOtpInputModule,

    StoreModule.forFeature('mfa', mfaReducers),
    EffectsModule.forFeature(mfaEffects),

    SharedModule,

    // ngx-sweet-alert
    SweetAlert2Module.forChild({
      async provideSwal() {
        return Swal.mixin({
          showCancelButton: false,
          showConfirmButton: false,
        })
      }
    })

  ],
  providers: [
    MfaService
  ]
})
export class MfaModule { }
