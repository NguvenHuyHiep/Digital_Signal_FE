import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import {
  COMPLETE_AUTHEN,
  GET_USER_PROFILE,
  SIGN_IN_SUCCESS,
  SIGN_OUT,
  VERIFY_OTP,
} from './authen.reducers';
import { LhAuthenService } from '../lh-authen.service';
import { forkJoin, of } from 'rxjs';
import { BaseOutputString } from '@app-api/lib/api/models/baseOutputString';
import { BaseOutputUser } from '@app-api/lib/api/models/baseOutputUser';
import { LhStorageService } from '../../local-store/lh-storage.service';
import { User } from '@app-api/lib/api/models/user';

@Injectable()
export class AuthenEffects {
  readonly SIGN_IN_SUCCESS = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(SIGN_IN_SUCCESS),
        tap((payload: { value?: { token: string; user: User } }) => {
          this.authenService.setApiToken(payload.value?.token);
          this._store.dispatch(
            GET_USER_PROFILE({ value: payload.value?.user as User })
          );
          this._store.dispatch(COMPLETE_AUTHEN({ value: true }));
        })
      );
    },
    { dispatch: false }
  );

  readonly VERIFY_OTP = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(VERIFY_OTP),
        tap((payload: { value: { email: string } }) => {
          this._storage.setEmail(payload.value.email);
        })
      );
    },
    { dispatch: false }
  );

  readonly GET_USER_PROFILE = createEffect(
    () =>
      this._actions$.pipe(
        ofType(GET_USER_PROFILE),
        tap((payload: { value?: User }) => {
          this._storage.setCurrentUser(payload.value);
        })
      ),
    { dispatch: false }
  );

  readonly SIGN_OUT = createEffect(
    () =>
      this._actions$.pipe(
        ofType(SIGN_OUT),
        tap((action) => {
          this.authenService.setApiToken(undefined);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private _store: Store,
    private _actions$: Actions,
    private authenService: LhAuthenService,
    private _storage: LhStorageService
  ) {}
}
