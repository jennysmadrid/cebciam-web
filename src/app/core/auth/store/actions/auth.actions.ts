import { Action } from '@ngrx/store';

export enum AuthActionTypes {
  REGISTER                = '[Auth] REGISTER',
  REGISTER_SUCCESS        = '[Auth] REGISTER_SUCCESS',
  REGISTER_ERROR          = '[Auth] REGISTER_ERROR',

  ACTIVATE_EMAIL          = '[Auth] ACTIVATE_EMAIL',
  ACTIVATE_EMAIL_SUCCESS  = '[Auth] ACTIVATE_EMAIL_SUCCESS',
  ACTIVATE_EMAIL_ERROR    = '[Auth] ACTIVATE_EMAIL_ERROR',

  LOGIN                   = '[Auth] LOGIN',
  LOGIN_SUCCESS           = '[Auth] LOGIN_SUCCESS',
  LOGIN_ERROR             = '[Auth] LOGIN_ERROR',

  LOGOUT                  = '[Auth] LOGOUT',
  LOGOUT_SUCCESS          = '[Auth] LOGOUT_SUCCESS',
  LOGOUT_ERROR            = '[Auth] LOGOUT_ERROR',

  FORGOT_PASSWORD         = '[Auth] FORGOT_PASSWORD',
  FORGOT_PASSWORD_SUCCESS = '[Auth] FORGOT_PASSWORD_SUCCESS',
  FORGOT_PASSWORD_ERROR   = '[Auth] FORGOT_PASSWORD_ERROR',

  GETGO_LOGIN             = '[Auth] LOGIN',
  GETGO_LOGIN_SUCCESS     = '[Auth] LOGIN_SUCCESS',
  GETGO_LOGIN_ERROR       = '[Auth] LOGIN_ERROR'
}

export class Register implements Action {
  readonly type = AuthActionTypes.REGISTER;
  constructor(public payload: any) {}
}

export class RegisterSuccess implements Action {
  readonly type = AuthActionTypes.REGISTER_SUCCESS;
  constructor(public payload: any) {}
}

export class RegisterError implements Action {
  readonly type = AuthActionTypes.REGISTER_ERROR;
  constructor(public payload: any) {}
}

export class ActivateEmail implements Action {
  readonly type = AuthActionTypes.ACTIVATE_EMAIL;
  constructor(public payload: any) {}
}

export class ActivateEmailSuccess implements Action {
  readonly type = AuthActionTypes.ACTIVATE_EMAIL_SUCCESS;
  constructor(public payload: any) {}
}

export class ActivateEmailError implements Action {
  readonly type = AuthActionTypes.ACTIVATE_EMAIL_ERROR;
  constructor(public payload: any) {}
}

export class Login implements Action {
  readonly type = AuthActionTypes.LOGIN;
  constructor(public payload: any) {}
}

export class LoginSuccess implements Action {
  readonly type = AuthActionTypes.LOGIN_SUCCESS;
  constructor(public payload: any) {}
}

export class LoginError implements Action {
  readonly type = AuthActionTypes.LOGIN_ERROR;
  constructor(public payload: any) {}
}

export class GetGoLogin implements Action {
  readonly type = AuthActionTypes.GETGO_LOGIN;
  constructor(public payload: any) { }
}

export class GetGoLoginSuccess implements Action {
  readonly type = AuthActionTypes.GETGO_LOGIN_SUCCESS;
  constructor(public payload: any) { }
}

export class GetGoLoginError implements Action {
  readonly type = AuthActionTypes.GETGO_LOGIN_ERROR;
  constructor(public payload: any) { }
}

export class Logout implements Action {
  readonly type = AuthActionTypes.LOGOUT;
  constructor(public payload?: any) {}
}

export class LogoutSuccess implements Action {
  readonly type = AuthActionTypes.LOGOUT_SUCCESS;
  constructor(public payload?: any) {}
}

export class LogoutError implements Action {
  readonly type = AuthActionTypes.LOGOUT_ERROR;
  constructor(public payload?: any) {}
}

//
export class ForgotPassword implements Action {
  readonly type = AuthActionTypes.FORGOT_PASSWORD;
  constructor(public payload?: any) {}
}

export class ForgotPasswordSuccess implements Action {
  readonly type = AuthActionTypes.FORGOT_PASSWORD_SUCCESS;
  constructor(public payload?: any) {}
}

export class ForgotPasswordError implements Action {
  readonly type = AuthActionTypes.FORGOT_PASSWORD_ERROR;
  constructor(public payload?: any) {}
}

export type AuthActionsUnion =
  | Register
  | RegisterSuccess
  | RegisterError
  | ActivateEmail
  | ActivateEmailSuccess
  | ActivateEmailError
  | Login
  | LoginSuccess
  | LoginError
  | Logout
  | LogoutSuccess
  | LogoutError
  | ForgotPassword
  | ForgotPasswordSuccess
  | ForgotPasswordError
    GetGoLogin
    GetGoLoginSuccess
    GetGoLoginError;

