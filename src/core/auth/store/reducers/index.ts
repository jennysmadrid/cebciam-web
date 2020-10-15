import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import * as fromAuth from './auth.reducers';
import * as fromUser from './user.reducers';

export interface AuthState {
  auth: fromAuth.AuthState
}

export interface UserState {
  user: fromUser.UserState
}

export const authReducers: ActionReducerMap<AuthState> = {
  auth: fromAuth.authReducer
}

export const userReducers: ActionReducerMap<UserState> = {
  user: fromUser.userReducer
};

export const getAuthState = createFeatureSelector<AuthState>('auth');
export const getUserState = createFeatureSelector<UserState>('user');
