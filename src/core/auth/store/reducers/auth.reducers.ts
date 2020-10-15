import { AuthActionTypes, AuthActionsUnion } from '../actions/auth.actions';

export interface AuthState {
  loading: boolean;
  loaded: boolean;
  user: any;
  status: string;

  register_response: any;
  email_response: boolean | object;
  forgot_password_response: boolean | object;
  forgot_password_error_response: any;

  isAuthenticated: boolean;
  login: any;
  login_error: any | boolean;
  getgo_login: any;
  getgo_login_error: any | boolean;
  logout: any;
}

export const initialAuthState: AuthState = {
  loading: true,
  loaded: false,
  status: '',
  user: null,
  register_response: null,
  email_response: false,
  forgot_password_response: false,
  forgot_password_error_response: null,
  isAuthenticated: false,
  login: null,
  login_error: null,
  getgo_login: null,
  getgo_login_error: null,
  logout: null
}

export function authReducer(state = initialAuthState, action: AuthActionsUnion): AuthState {
  switch (action.type) {

    case AuthActionTypes.REGISTER: {
      return {
        ...state,
        loading: true,
        loaded: false
      }
    }

    case AuthActionTypes.REGISTER_SUCCESS: {
      return {
        ...state,
        loading: true,
        loaded: false,
        register_response: action.payload
      }
    }

    case AuthActionTypes.REGISTER_ERROR: {
      return {
        ...state,
        loading: true,
        loaded: false,
        register_response: null
      }
    }

    case AuthActionTypes.ACTIVATE_EMAIL: {
      return {
        ...state,
        loading: true,
        loaded: false
      }
    }

    case AuthActionTypes.ACTIVATE_EMAIL_SUCCESS: {
      return {
        ...state,
        loading: false,
        loaded: true,
        email_response: action.payload
      }
    }

    case AuthActionTypes.ACTIVATE_EMAIL_ERROR: {
      return {
        ...state,
        loading: false,
        loaded: true,
        email_response: action.payload
      }
    }

    case AuthActionTypes.LOGIN: {
      return {
        ...state,
        loading: true,
        loaded: false,
        login_error: null
      }
    }

    case AuthActionTypes.LOGIN_SUCCESS: {
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        login: action.payload,
      }
    }

    case AuthActionTypes.LOGIN_ERROR: {
      return {
        ...state,
        user: null,
        login_error: action.payload
      }
    }

    case AuthActionTypes.GETGO_LOGIN: {
      return {
        ...state,
        loading: true,
        loaded: false,
        getgo_login_error: null
      }
    }

    case AuthActionTypes.GETGO_LOGIN_SUCCESS: {
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        login: action.payload,
      }
    }

    case AuthActionTypes.GETGO_LOGIN_ERROR: {
      return {
        ...state,
        user: null,
        login_error: action.payload
      }
    }

    case AuthActionTypes.LOGOUT: {
      return {
        ...state,
        logout: true,
        user: null,
        login: null
      }
    }

    case AuthActionTypes.FORGOT_PASSWORD: {
      return {
        ...state,
        loading: true,
        loaded: false
      }
    }

    case AuthActionTypes.FORGOT_PASSWORD_SUCCESS: {
      return {
        ...state,
        loading: false,
        loaded: true,
        forgot_password_response: true
      }
    }

    case AuthActionTypes.FORGOT_PASSWORD_ERROR: {
      return {
        ...state,
        loading: false,
        loaded: true,
        forgot_password_error_response: action.payload
      }
    }

    default:
      return state;
  }

}

export const getLoginErrorResponse           = (state: AuthState) => state.login_error;
export const getRegisterResponse             = (state: AuthState) => state.register_response;
export const getEmailActivationResponse      = (state: AuthState) => state.email_response;
export const getForgotPasswordResponse       = (state: AuthState) => state.forgot_password_response;
export const getForgotPasswordErrorResponse = (state: AuthState) => state.forgot_password_error_response;
export const getGetGoLoginErrorResponse     = (state: AuthState) => state.getgo_login_error;
