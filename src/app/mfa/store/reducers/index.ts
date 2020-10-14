import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import * as fromMfa from './mfa.reducers';

export interface MfaState {
  mfa: fromMfa.MfaState
}

export const mfaReducers: ActionReducerMap<MfaState> = {
  mfa: fromMfa.mfaReducer
}

export const getMfaState = createFeatureSelector<MfaState>('mfa');
