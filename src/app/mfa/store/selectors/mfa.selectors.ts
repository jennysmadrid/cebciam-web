import { createSelector } from '@ngrx/store';
import * as fromFeatureReducer from '@app/mfa/store/reducers';
import * as fromMfaReducer from '@app/mfa/store/reducers/mfa.reducers';

export const getCompleteMfaState = createSelector(
  fromFeatureReducer.getMfaState,
  (state: fromFeatureReducer.MfaState) => state.mfa
);

export const getMfaEnrollResponseEntities = createSelector(
  getCompleteMfaState,
  fromMfaReducer.getMfaEnrollResponse
);

export const getMfaEnrollErrorResponseEntities = createSelector(
  getCompleteMfaState,
  fromMfaReducer.getMfaEnrollErrorResponse
);

export const getMfaActivateResponseEntities = createSelector(
  getCompleteMfaState,
  fromMfaReducer.getMfaActivateResponse
);

export const getMfaChallengeResponseEntities = createSelector(
  getCompleteMfaState,
  fromMfaReducer.getMfaChallengeResponse
);

export const getMfaVerifyChallengeResponseEntities = createSelector(
  getCompleteMfaState,
  fromMfaReducer.getMfaVerifyChallengeResponse
);

export const selectMfaEnrollResponse                 = createSelector(getMfaEnrollResponseEntities, response => response);
export const selectMfaEnrollErrorResponse            = createSelector(getMfaEnrollErrorResponseEntities, response => response);
export const selectMfaActivateResponse               = createSelector(getMfaActivateResponseEntities, response => response);
export const selectMfaChallengeResponse              = createSelector(getMfaChallengeResponseEntities, response => response);
export const selectMfaVerifyChallengeResponse        = createSelector(getMfaVerifyChallengeResponseEntities, response => response);
