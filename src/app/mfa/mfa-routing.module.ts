import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MfaTemplateComponent } from './components/mfa-template/mfa-template.component';
import { VerificationComponent } from './components/verification/verification.component';
import { EnrollmentComponent } from './components/enrollment/enrollment.component';

const routes: Routes = [
  {
    path: ':action-type',
    component: MfaTemplateComponent,
    pathMatch: 'full',
  },
  {
    path: 'verification/:action-type/:type',
    component: VerificationComponent,
  },
  {
    path: 'enrollment/:type',
    component: EnrollmentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MfaRoutingModule { }
