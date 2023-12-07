import { Inject, Injectable } from '@angular/core';
import { BaseOutputString } from '@app-api/lib/api/models/baseOutputString';
import { BaseOutputUser } from '@app-api/lib/api/models/baseOutputUser';
import { User } from '@app-api/lib/api/models/user';
import { LH_API_VERSION } from '@app-api/public-api';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { Observable, filter, map } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LhStorageService } from '../local-store/lh-storage.service';
import { SIGN_IN_FAILED, SIGN_IN_SUCCESS } from './store/authen.reducers';
import {
  AdminUsersAPIService,
  AuthenticationControllerService,
} from '@app-api/lib/api';
import { ResponseStatus } from '@app-api/lib/api/models/responseStatus';

@Injectable({
  providedIn: 'root',
})
export class LhAuthenService {
  constructor(
    private authenticationService: AuthenticationControllerService,
    private adminUsersAPIService: AdminUsersAPIService,
    private _storageService: LhStorageService,
    private _store: Store,
    @Inject(LH_API_VERSION) private apiVersion: string
  ) {}

  public login(
    username: string,
    password: string
  ): Observable<BaseOutputString> {
    return this.authenticationService
      .login({
        email: username,
        password: password,
      })
      .pipe(
        tap((response) => {
          if (
            !response ||
            !response.data ||
            response.status !== ResponseStatus.Success
          ) {
            return this._store.dispatch(SIGN_IN_FAILED({ value: response }));
          } else if (response != null) {
            return this._store.dispatch(
              SIGN_IN_SUCCESS({ value: { token: response, email: username } })
            );
          }
        })
      );
  }

  public userInfo(id?: number): Observable<BaseOutputUser> {
    return this.adminUsersAPIService.getById(id as number);
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

  public getUserInfoByEmail(email: string): Observable<BaseOutputUser> {
    return this.adminUsersAPIService.getByEmail(email);
  }

  setApiKeys(token?: BaseOutputString): void {
    console.log(token);
    if (token) {
      this.authenticationService.configuration.withCredentials = true;
      this.authenticationService.configuration.credentials = {
        Authorization: `${token.data}`,
      };
      this._storageService.setToken(token).subscribe();
    } else {
      this.authenticationService.configuration.credentials = {};
      this._storageService.setToken(undefined).subscribe();
      this._storageService.setCurrentUser(undefined).subscribe();
      this._storageService.setCurrentUser(undefined).subscribe();
    }
  }
}
