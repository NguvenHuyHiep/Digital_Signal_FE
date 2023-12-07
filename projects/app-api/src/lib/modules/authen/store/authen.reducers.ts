import { ActionReducer } from '@ngrx/store/src/models';
import { createAction, createReducer, on, props } from '@ngrx/store';
import { HttpResponseBase } from '@angular/common/http';
import { BaseOutputString } from '@app-api/lib/api/models/baseOutputString';
import { BaseOutputUser } from '@app-api/lib/api/models/baseOutputUser';

export enum AUTHEN_ACTIONS {
  SIGN_IN_SUCCESS = '@lh/authen/SIGN_IN_SUCCESS',
  SIGN_IN_FAILED = '@lh/authen/SIGN_IN_FAILED',
  GET_USER_PROFILE = '@lh/authen/GET_USER_PROFILE',
  COMPLETE_AUTHEN = '@lh/authen/COMPLETE_AUTHEN',
  SIGN_OUT = '@lh/authen/SIGN_OUT',
}

export const SIGN_IN_SUCCESS = createAction(
  AUTHEN_ACTIONS.SIGN_IN_SUCCESS,
  props<{ value?: { token: BaseOutputString; email: string } }>()
);
export const COMPLETE_AUTHEN = createAction(
  AUTHEN_ACTIONS.COMPLETE_AUTHEN,
  props<{ value: boolean }>()
);
export const GET_USER_PROFILE = createAction(
  AUTHEN_ACTIONS.GET_USER_PROFILE,
  props<{ value?: BaseOutputUser }>()
);

export const SIGN_IN_FAILED = createAction(
  AUTHEN_ACTIONS.SIGN_IN_FAILED,
  props<{ value?: HttpResponseBase | BaseOutputString }>()
);
export const SIGN_OUT = createAction(AUTHEN_ACTIONS.SIGN_OUT);

export interface IAuthenState {
  token: BaseOutputString | undefined;
  user: BaseOutputUser | undefined;
  authenticated: boolean;
  error: HttpResponseBase | BaseOutputUser | undefined;
  retry: number;
  initAuthen: boolean;
}

const initialState: IAuthenState = {
  token: undefined,
  user: undefined,
  authenticated: false,
  error: undefined,
  retry: 0,
  initAuthen: false,
};

export const authenReducer: ActionReducer<IAuthenState> = createReducer(
  initialState,
  on(SIGN_IN_SUCCESS, (state, { value }) => ({
    ...state,
    token: value?.token,
    authenticated: true,
    initAuthen: true,
    error: undefined,
    retry: 0,
  })),

  on(COMPLETE_AUTHEN, (state, { value }) => ({
    ...state,
    initAuthen: value,
  })),

  on(GET_USER_PROFILE, (state, { value }) => ({
    ...state,
    user: value,
  })),

  on(SIGN_IN_FAILED, (state, { value }) => ({
    ...state,
    token: undefined,
    user: undefined,
    authenticated: false,
    initAuthen: false,
    error: value as any,
    retry: state.retry + 1,
  })),

  on(SIGN_OUT, (state) => ({
    ...state,
    token: undefined,
    user: undefined,
    authenticated: false,
    error: undefined,
    initAuthen: false,
    retry: 0,
  }))
);
