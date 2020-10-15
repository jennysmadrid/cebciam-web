import { createSelector } from '@ngrx/store';
import * as fromFeatureReducer from '@app/core/auth/store/reducers';
import * as fromAuthReducer from '@app/core/auth/store/reducers/auth.reducers';

export const getCompleteAuthState = createSelector(
  fromFeatureReducer.getAuthState,
  (state: fromFeatureReducer.AuthState) => state.auth
);

export const getLoginErrorResponseEntities = createSelector(
  getCompleteAuthState,
  fromAuthReducer.getLoginErrorResponse
);

export const getGetGoLoginErrorResponseEntities = createSelector(
  getCompleteAuthState,
  fromAuthReducer.getGetGoLoginErrorResponse
);

export const getRegisterResponseEntities = createSelector(
  getCompleteAuthState,
  fromAuthReducer.getRegisterResponse
);

export const getEmaiLActivationResponseEntities = createSelector(
  getCompleteAuthState,
  fromAuthReducer.getEmailActivationResponse
);

export const getForgotPasswordResponseEntities = createSelector(
  getCompleteAuthState,
  fromAuthReducer.getForgotPasswordResponse
);

export const getForgotPasswordErrorResponseEntities = createSelector(
  getCompleteAuthState,
  fromAuthReducer.getForgotPasswordErrorResponse
);

export const selectLoginErrorResponseEntities        = createSelector(getLoginErrorResponseEntities, response => response);
export const selectRegisterResponse                  = createSelector(getRegisterResponseEntities, response => response);
export const selectEmailActivationResponse           = createSelector(getEmaiLActivationResponseEntities, response => response);
export const selectForgotPasswordResponse            = createSelector(getForgotPasswordResponseEntities, response => response);
export const selectForgotPasswordErrorResponse       = createSelector(getForgotPasswordErrorResponseEntities, response => response);
export const selectGetGoLoginErrorResponseEntities   = createSelector(getGetGoLoginErrorResponseEntities, response => response);
