import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import {
  COMPLETE_AUTHEN,
  GET_USER_PROFILE,
  SIGN_IN_SUCCESS,
  SIGN_OUT,
} from './authen.reducers';
import { LhAuthenService } from '../lh-authen.service';
import { forkJoin, of } from 'rxjs';
import { BaseOutputString } from '@app-api/lib/api/models/baseOutputString';
import { BaseOutputUser } from '@app-api/lib/api/models/baseOutputUser';
import { LhStorageService } from '../../local-store/lh-storage.service';

@Injectable()
export class AuthenEffects {
  readonly SIGN_IN_SUCCESS = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(SIGN_IN_SUCCESS),
        tap((payload: { value?: { token: string; email: string } }) => {
          this.authenService.setApiToken(payload.value?.token);
          let authenObs = this.authenService
            .getUserInfoByEmail(payload.value?.email as string)
            .pipe(
              tap((user) => {
                this._store.dispatch(GET_USER_PROFILE({ value: user }));
              })
            );
          return forkJoin([authenObs]).subscribe({
            next: (result) =>
              this._store.dispatch(COMPLETE_AUTHEN({ value: true })),
            error: (err) => {
              this._store.dispatch(SIGN_OUT());
            },
          });
        })
      );
    },
    { dispatch: false }
  );

  readonly GET_USER_PROFILE = createEffect(
    () =>
      this._actions$.pipe(
        ofType(GET_USER_PROFILE),
        tap((payload: { value?: BaseOutputUser }) => {
          this._storage.setCurrentUser(payload.value?.data);
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
