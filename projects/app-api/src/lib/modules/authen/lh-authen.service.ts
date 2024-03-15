import { Injectable } from '@angular/core';
import { AdminUserApiService } from '@app-api/lib/api/apis/admin/admin-user.api.service';
import { AuthApiService } from '@app-api/lib/api/apis/auth.api.service';
import { BaseOutputString } from '@app-api/lib/api/models/baseOutputString';
import { BaseOutputUser } from '@app-api/lib/api/models/baseOutputUser';
import { ResponseStatus } from '@app-api/lib/api/models/responseStatus';
import { User } from '@app-api/lib/api/models/user';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { Observable, filter, map, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LhStorageService } from '../local-store/lh-storage.service';
import {
  SIGN_IN_FAILED,
  SIGN_IN_SUCCESS,
  VERIFY_OTP,
} from './store/authen.reducers';
import { BaseOutputAuth } from '@app-api/lib/api/models/baseOutputAuth';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LhAuthenService {
  constructor(
    private authApiService: AuthApiService,
    private adminUserApiService: AdminUserApiService,
    private _storageService: LhStorageService,
    private _store: Store,
    private msg: NzMessageService,
    private translate: TranslateService,
    private router: Router
  ) {}

  public login(email: string, password: string): Observable<BaseOutputAuth> {
    return this.authApiService.login(email, password).pipe(
      tap((response) => {
        if (
          response != null &&
          response.status === ResponseStatus.Success &&
          response.data &&
          response.data.user &&
          response.data.token
        ) {
          // admin login
          this._store.dispatch(
            SIGN_IN_SUCCESS({
              value: { token: response.data.token, user: response.data.user },
            })
          );
          return;
        } else if (
          response != null &&
          response.status === ResponseStatus.Success &&
          !response.data
        ) {
          // user login, navigate to otp
          this._store.dispatch(
            VERIFY_OTP({
              value: { email: email },
            })
          );
          return;
        }
        this._store.dispatch(SIGN_IN_FAILED({ value: response }));
      })
    );
  }

  public verifyOtp(email: string, otp: string): Observable<BaseOutputAuth> {
    return this.authApiService.verifyOtp(email, otp).pipe(
      tap((response) => {
        if (
          response != null &&
          response.status === ResponseStatus.Success &&
          response.data &&
          response.data.user &&
          response.data.token
        ) {
          this._store.dispatch(
            SIGN_IN_SUCCESS({
              value: { token: response.data.token, user: response.data.user },
            })
          );
        } else {
          this._store.dispatch(SIGN_IN_FAILED({ value: response }));
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
