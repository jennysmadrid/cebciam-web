import { createSelector } from '@ngrx/store';
import * as fromFeatureReducer from '@app/core/auth/store/reducers';
import * as fromUserReducer from '@app/core/auth/store/reducers/user.reducers';

export const getCompleteUserState = createSelector(
  fromFeatureReducer.getUserState,
  (state: fromFeatureReducer.UserState) => state.user
);

export const getEditProfileResponseEntities = createSelector(
  getCompleteUserState,
  fromUserReducer.getEditUserProfileResponse
);

export const getChangePasswordResponseEntities = createSelector(
  getCompleteUserState,
  fromUserReducer.getChangePasswordResponse
);

export const getDeactivateAccountResponseEntities = createSelector(
  getCompleteUserState,
  fromUserReducer.getDeactivateAccountResponse
);

export const getDeleteAccountResponseEntities = createSelector(
  getCompleteUserState,
  fromUserReducer.getDeleteAccountResponse
);

export const selectEditUserProfileResponse   = createSelector(getEditProfileResponseEntities, response => response);
export const selectChangePasswordResponse    = createSelector(getChangePasswordResponseEntities, response => response);
export const selectDeactivateAccountResponse = createSelector(getDeactivateAccountResponseEntities, response => response);
export const selectDeleteAccountResponse     = createSelector(getDeleteAccountResponseEntities, response => response);
