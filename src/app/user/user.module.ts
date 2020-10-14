import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@app/shared';

// material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';


// ngx-sweet-alert
import Swal from 'sweetalert2';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { UserRoutingModule } from './user-routing.module';
import { UserTemplateComponent } from './user-template/user-template.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ProfileComponent } from './profile/profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { UnregisterComponent } from './shared/modals/unregister/unregister.component';


@NgModule({
  declarations: [
    UserTemplateComponent,
    ChangePasswordComponent,
    ProfileComponent,
    EditProfileComponent,
    UnregisterComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    UserRoutingModule,
    SharedModule,

    // material
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatListModule,

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
  exports: [
    UnregisterComponent
  ]
})
export class UserModule { }
