import { Injectable } from '@angular/core';
import { AdminUserApiService } from '@app-api/lib/api/apis/admin/admin-user.api.service';
import { AuthApiService } from '@app-api/lib/api/apis/auth.api.service';
import { BaseOutputString } from '@app-api/lib/api/models/baseOutputString';
import { BaseOutputUser } from '@app-api/lib/api/models/baseOutputUser';
import { ResponseStatus } from '@app-api/lib/api/models/responseStatus';
import { User } from '@app-api/lib/api/models/user';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { Observable, filter, map } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LhStorageService } from '../local-store/lh-storage.service';
import { SIGN_IN_FAILED, SIGN_IN_SUCCESS } from './store/authen.reducers';

@Injectable({
  providedIn: 'root',
})
export class LhAuthenService {
  constructor(
    private authApiService: AuthApiService,
    private adminUserApiService: AdminUserApiService,
    private _storageService: LhStorageService,
    private _store: Store
  ) {}

  public login(email: string, password: string): Observable<BaseOutputString> {
    return this.authApiService.login(email, password).pipe(
      tap((response) => {
        if (
          !response ||
          !response.data ||
          response.status !== ResponseStatus.Success
        ) {
          return this._store.dispatch(SIGN_IN_FAILED({ value: response }));
        } else if (response != null) {
          return this._store.dispatch(
            SIGN_IN_SUCCESS({
              value: { token: response.data, email: email },
            })
          );
        }
      })
    );
  }

  public isAuthenObs(): Observable<boolean> {
    return this._store
      .select((state) => _.get(state, 'authentication'))
      .pipe(
        filter((a: any) => _.get(a, 'initAuthen'), false),
        map((a) => {
          return _.get(a, 'authenticated', false);
        })
      );
  }

  public get userObs(): Observable<User> {
    return this._store.select<User>((state) => {
      let user: User = _.get(
        state,
        'authentication.user.data'
      ) as unknown as User;
      return user;
    });
  }

  public userInfo(id?: number): Observable<BaseOutputUser> {
    return this.adminUserApiService.getById(id as number);
  }

  public getUserInfoByEmail(email: string): Observable<BaseOutputUser> {
    return this.adminUserApiService.getByEmail(email);
  }

  setApiToken(token?: string): void {
    console.log(token);
    if (token) {
      this._storageService.setToken(token);
    } else {
      this._storageService.setToken(undefined);
      this._storageService.setCurrentUser(undefined);
      this._storageService.setCurrentUser(undefined);
    }
  }
}
