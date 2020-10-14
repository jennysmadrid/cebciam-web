import { Action } from '@ngrx/store';

export enum UserActionTypes {
  EDIT_PROFILE           = '[User] EDIT_PROFILE',
  EDIT_PROFILE_SUCCESS   = '[User] EDIT_PROFILE',
  EDIT_PROFILE_ERROR     = '[User] EDIT_PROFILE',

  CHANGE_PASSWORD         = '[User] CHANGE_PASSWORD',
  CHANGE_PASSWORD_SUCCESS = '[User] CHANGE_PASSWORD_SUCCESS',
  CHANGE_PASSWORD_ERROR   = '[User] CHANGE_PASSWORD_ERROR',


  DEACTIVATE_ACCOUNT         = '[User] DEACTIVATE_ACCOUNT',
  DEACTIVATE_ACCOUNT_SUCCESS = '[User] DEACTIVATE_ACCOUNT_SUCCESS',
  DEACTIVATE_ACCOUNT_ERROR   = '[User] DEACTIVATE_ACCOUNT_ERROR',

  DELETE_ACCOUNT             = '[User] DELETE_ACCOUNT',
  DELETE_ACCOUNT_SUCCESS     = '[User] DELETE_ACCOUNT_SUCCESS',
  DELETE_ACCOUNT_ERROR       = '[User] DELETE_ACCOUNT_ERROR',
}

export class EditProfile implements Action {
  readonly type = UserActionTypes.EDIT_PROFILE;
  constructor(public payload: any) {}
}

export class EditProfileSuccess implements Action {
  readonly type = UserActionTypes.EDIT_PROFILE_SUCCESS;
  constructor(public payload: any) {}
}

export class EditProfileError implements Action {
  readonly type = UserActionTypes.EDIT_PROFILE_ERROR;
  constructor(public payload: any) {}
}
export class ChangePassword implements Action {
  readonly type = UserActionTypes.CHANGE_PASSWORD;
  constructor(public payload: any) {}
}

export class ChangePasswordSuccess implements Action {
  readonly type = UserActionTypes.CHANGE_PASSWORD_SUCCESS;
  constructor(public payload: any) {}
}

export class ChangePasswordError implements Action {
  readonly type = UserActionTypes.CHANGE_PASSWORD_ERROR;
  constructor(public payload: any) {}
}

export class DeactivateAccount implements Action {
  readonly type = UserActionTypes.DEACTIVATE_ACCOUNT;
  constructor(public payload: any) {}
}

export class DeactivateAccountSuccess implements Action {
  readonly type = UserActionTypes.DEACTIVATE_ACCOUNT_SUCCESS;
  constructor(public payload: any) {}
}

export class DeactivateAccountError implements Action {
  readonly type = UserActionTypes.DEACTIVATE_ACCOUNT_ERROR;
  constructor(public payload: any) {}
}

export class DeleteAccount implements Action {
  readonly type = UserActionTypes.DELETE_ACCOUNT;
  constructor(public payload: any) {}
}

export class DeleteAccountSuccess implements Action {
  readonly type = UserActionTypes.DELETE_ACCOUNT_SUCCESS;
  constructor(public payload: any) {}
}

export class DeleteAccountError implements Action {
  readonly type = UserActionTypes.DELETE_ACCOUNT_ERROR;
  constructor(public payload: any) {}
}

export type UserActionsUnion =
  | EditProfile
  | EditProfileSuccess
  | EditProfileError
  | ChangePassword
  | ChangePasswordSuccess
  | ChangePasswordError
  | DeactivateAccount
  | DeactivateAccountSuccess
  | DeactivateAccountError
  | DeleteAccount
  | DeleteAccountSuccess
  | DeleteAccountError;
