import { Component, OnInit } from '@angular/core';

import {
  FormGroup,
  FormControl,
  Validators,
  FormArray
} from '@angular/forms';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  public resetPasswordFormGroup: FormGroup;

  constructor() { }

  ngOnInit(): void {
    this.resetPasswordFormGroup = this.form();
  }

  form() {
    return new FormGroup({
      password        : new FormControl(null, Validators.required),
      confirmPassword : new FormControl(null, Validators.required)
    });
  }

  submit() {

    Swal.fire({
      title: `<b> Password Reset Successful!</b>`,
      imageUrl: 'assets/icons/svg/check-with-arrows.svg',
      showConfirmButton: false
    })

  }

}
