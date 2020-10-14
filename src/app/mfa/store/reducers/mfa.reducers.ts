import { MfaActionsUnion, MfaActionTypes } from '../actions/mfa.actions';

export interface MfaState {
  loading: boolean;
  loaded: boolean;
  status: string;
  error: any;
  mfa_enroll_response: any;
  mfa_enroll_error_response: any;
  mfa_activate_response: any;
  mfa_challenge_response: any;
  mfa_challenge_verify_response: any;
}

export const initialMfaState: MfaState = {
  loading: true,
  loaded: false,
  status: '',
  error: null,
  mfa_enroll_response: null,
  mfa_enroll_error_response: null,
  mfa_activate_response: null,
  mfa_challenge_response: null,
  mfa_challenge_verify_response: null
}

export function mfaReducer(state = initialMfaState, action: MfaActionsUnion): MfaState {
  switch (action.type) {

    case MfaActionTypes.MFA_ENROLL: {
      return {
        ...state,
        loading: true,
        loaded: false,
        mfa_enroll_response: null,
        mfa_enroll_error_response: null
      }
    }

    case MfaActionTypes.MFA_ENROLL_SUCCESS: {
      return {
        ...state,
        loading: false,
        loaded: true,
        mfa_enroll_response: action.payload
      }
    }

    case MfaActionTypes.MFA_ENROLL_ERROR: {
      return {
        ...state,
        loading: true,
        loaded: false,
        mfa_enroll_error_response: action.payload
      }
    }

    case MfaActionTypes.MFA_ACTIVATE: {
      return {
        ...state,
        loading: true,
        loaded: false,
        mfa_activate_response: null
      }
    }

    case MfaActionTypes.MFA_ACTIVATE_SUCCESS: {
      return {
        ...state,
        loading: false,
        loaded: true,
        mfa_activate_response: action.payload
      }
    }

    case MfaActionTypes.MFA_CHALLENGE: {
      return {
        ...state,
        loading: true,
        loaded: false,
        mfa_challenge_response: null
      }
    }

    case MfaActionTypes.MFA_CHALLENGE_SUCCESS: {
      return {
        ...state,
        loading: false,
        loaded: true,
        mfa_challenge_response: action.payload
      }
    }

    case MfaActionTypes.MFA_VERIFY_CHALLENGE: {
      return {
        ...state,
        loading: true,
        loaded: false,
        mfa_challenge_verify_response: null,
      }
    }

    case MfaActionTypes.MFA_VERIFY_CHALLENGE_SUCCESS: {
      return {
        ...state,
        loading: false,
        loaded: true,
        mfa_challenge_verify_response: action.payload
      }
    }

    default:
      return state;
  }

}

export const getMfaEnrollResponse                 = (state: MfaState) => state.mfa_enroll_response;
export const getMfaEnrollErrorResponse            = (state: MfaState) => state.mfa_enroll_error_response;
export const getMfaActivateResponse               = (state: MfaState) => state.mfa_activate_response;
export const getMfaChallengeResponse              = (state: MfaState) => state.mfa_challenge_response;
export const getMfaVerifyChallengeResponse        = (state: MfaState) => state.mfa_challenge_verify_response;
