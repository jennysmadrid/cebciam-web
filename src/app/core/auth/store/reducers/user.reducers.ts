import { UserActionTypes, UserActionsUnion } from '../actions/user.actions';

export interface UserState {
  loading: boolean;
  loaded: boolean;
  user_profile_response: any;
  change_password_response: any;
  deactivate_account_response: any;
  delete_account_response: any;
  status: string;
}

export const initialUserState: UserState = {
  loading: true,
  loaded: false,
  status: '',
  user_profile_response: null,
  change_password_response: null,
  deactivate_account_response: null,
  delete_account_response: null
}

export function userReducer(state = initialUserState, action: UserActionsUnion): UserState {
  switch (action.type) {

    case UserActionTypes.EDIT_PROFILE: {
      return {
        ...state,
        loading: true,
        loaded: false
      }
    }

    case UserActionTypes.EDIT_PROFILE_SUCCESS: {
      return {
        ...state,
        loading: false,
        loaded: true,
        user_profile_response: action.payload
      }
    }

    case UserActionTypes.EDIT_PROFILE_ERROR: {
      return {
        ...state,
        loading: false,
        loaded: true,
        status: 'Edit Profile Error'
      }
    }

    case UserActionTypes.CHANGE_PASSWORD: {
      return {
        ...state,
        loading: true,
        loaded: false
      }
    }

    case UserActionTypes.CHANGE_PASSWORD_SUCCESS: {
      return {
        ...state,
        loading: false,
        loaded: true,
        change_password_response: action.payload
      }
    }

    case UserActionTypes.CHANGE_PASSWORD_ERROR: {
      return {
        ...state,
        loading: false,
        loaded: true,
        status: 'Change Password Error'
      }
    }

    case UserActionTypes.DEACTIVATE_ACCOUNT: {
      return {
        ...state,
        loading: true,
        loaded: false,
      }
    }

    case UserActionTypes.DEACTIVATE_ACCOUNT_SUCCESS: {
      return {
        ...state,
        loading: true,
        loaded: false,
        deactivate_account_response: true
      }
    }

    case UserActionTypes.DEACTIVATE_ACCOUNT_ERROR: {
      return {
        ...state,
        loading: false,
        loaded: true
      }
    }

    case UserActionTypes.DELETE_ACCOUNT: {
      return {
        ...state,
        loading: true,
        loaded: false,
      }
    }

    case UserActionTypes.DELETE_ACCOUNT_SUCCESS: {
      return {
        ...state,
        loading: false,
        loaded: true,
        delete_account_response: true
      }
    }

    case UserActionTypes.DELETE_ACCOUNT_ERROR: {
      return {
        ...state,
        loading: false,
        loaded: true,
      }
    }

    default:
      return state;
  }

}

export const getEditUserProfileResponse   = (state: UserState) => state.user_profile_response;
export const getChangePasswordResponse    = (state: UserState) => state.change_password_response;
export const getDeactivateAccountResponse = (state: UserState) => state.deactivate_account_response;
export const getDeleteAccountResponse     = (state: UserState) => state.delete_account_response;
