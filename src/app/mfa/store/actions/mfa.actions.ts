import { Action } from '@ngrx/store';

export enum MfaActionTypes {
  MFA_ENROLL                    = '[Auth] MFA_ENROLL',
  MFA_ENROLL_SUCCESS            = '[Auth] MFA_ENROLL_SUCCESS',
  MFA_ENROLL_ERROR              = '[Auth] MFA_ENROLL_ERROR',

  MFA_ACTIVATE                  = '[Auth] MFA_ACTIVATE',
  MFA_ACTIVATE_SUCCESS          = '[Auth] MFA_ACTIVATE_SUCCESS',
  MFA_ACTIVATE_ERROR            = '[Auth] MFA_ACTIVATE_ERROR',

  MFA_CHALLENGE                 = '[Auth] MFA_CHALLENGE',
  MFA_CHALLENGE_SUCCESS         = '[Auth] MFA_CHALLENGE_SUCCESS',
  MFA_CHALLENGE_ERROR           = '[Auth] MFA_CHALLENGE_ERROR',

  MFA_VERIFY_CHALLENGE          = '[Auth] MFA_VERIFY_CHALLENGE',
  MFA_VERIFY_CHALLENGE_SUCCESS  = '[Auth] MFA_VERIFY_CHALLENGE_SUCCESS',
  MFA_VERIFY_CHALLENGE_ERROR    = '[Auth] MFA_VERIFY_CHALLENGE_ERROR'
}

export class MfaEnroll implements Action {
  readonly type = MfaActionTypes.MFA_ENROLL;
  constructor(public payload: any) {}
}

export class MfaEnrollSuccess implements Action {
  readonly type = MfaActionTypes.MFA_ENROLL_SUCCESS;
  constructor(public payload: any) {}
}

export class MfaEnrollError implements Action {
  readonly type = MfaActionTypes.MFA_ENROLL_ERROR;
  constructor(public payload: any) {}
}

export class MfaActivate implements Action {
  readonly type = MfaActionTypes.MFA_ACTIVATE;
  constructor(public payload: any) {}
}

export class MfaActivateSuccess implements Action {
  readonly type = MfaActionTypes.MFA_ACTIVATE_SUCCESS;
  constructor(public payload: any) {}
}

export class MfaActivateError implements Action {
  readonly type = MfaActionTypes.MFA_ACTIVATE_ERROR;
  constructor(public payload: any) {}
}

export class MfaChallenge implements Action {
  readonly type = MfaActionTypes.MFA_CHALLENGE;
  constructor(public payload: any) {}
}

export class MfaChallengeSuccess implements Action {
  readonly type = MfaActionTypes.MFA_CHALLENGE_SUCCESS;
  constructor(public payload: any) {}
}

export class MfaChallengeError implements Action {
  readonly type = MfaActionTypes.MFA_CHALLENGE_ERROR;
  constructor(public payload: any) {}
}

export class MfaVerifyChallenge implements Action {
  readonly type = MfaActionTypes.MFA_VERIFY_CHALLENGE;
  constructor(public payload: any) {}
}

export class MfaVerifyChallengeSuccess implements Action {
  readonly type = MfaActionTypes.MFA_VERIFY_CHALLENGE_SUCCESS;
  constructor(public payload: any) {}
}

export class MfaVerifyChallengeError implements Action {
  readonly type = MfaActionTypes.MFA_VERIFY_CHALLENGE_ERROR;
  constructor(public payload: any) {}
}

export type MfaActionsUnion =
  | MfaEnroll
  | MfaEnrollSuccess
  | MfaEnrollError
  | MfaActivate
  | MfaActivateSuccess
  | MfaActivateError
  | MfaChallenge
  | MfaChallengeSuccess
  | MfaChallengeError
  | MfaVerifyChallenge
  | MfaVerifyChallengeSuccess
  | MfaVerifyChallengeError;
