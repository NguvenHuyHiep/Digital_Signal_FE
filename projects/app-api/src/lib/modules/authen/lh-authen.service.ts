import {Inject, Injectable} from '@angular/core';
import {filter, map, Observable, of} from "rxjs";
import {
  AccountService,
  ResponseUserInfo, ResponseUserInfoCustomApiObjResponse,
  TokenReturn, TokenReturnCustomApiObjResponse
} from "../../api";
import {LH_API_VERSION} from "../../../public-api";
import {LhStorageService} from "../local-store/lh-storage.service";
import {Store} from "@ngrx/store";
import * as _ from 'lodash';
import {tap} from "rxjs/operators";
import {SIGN_IN_FAILED, SIGN_IN_SUCCESS} from "./store/authen.reducers";


@Injectable({
  providedIn: 'root'
})
export class LhAuthenService {

  constructor(
    private _accountService: AccountService,
    private _storageService: LhStorageService,
    private _store: Store,
    @Inject(LH_API_VERSION) private apiVersion: string
  ) {
  }


  public login(username: string, password: string, rememberMe: boolean = false): Observable<ResponseUserInfoCustomApiObjResponse> {
    let login: any = {
      userName: username
      , password: password
      , rememberMe: rememberMe
    };

    return of<TokenReturnCustomApiObjResponse>({
      result: {
        access_token: "sdfsdfdsfsdfsdf"
      }
    }).pipe(
      tap((response) => {
        if (response.message && response.message != '' && response.result == null) {
          this._store.dispatch(SIGN_IN_FAILED({value: response}))
        } else if (response != null) {
          this._store.dispatch(SIGN_IN_SUCCESS({value: response.result}))
        }
      })
    );
  }

  public userInfo(id?: string): Observable<ResponseUserInfoCustomApiObjResponse> {
    return this._accountService.userInfo(this.apiVersion, id);
  }



  public isAuthenObs(): Observable<boolean> {
    return this._store.select(state => _.get(state, 'authentication')).pipe(
      filter((a: any) => _.get(a, 'initAuthen'), false),
      map(a => {
        return _.get(a, 'authenticated', false);
      }));
  }

  public get userObs(): Observable<ResponseUserInfo> {
    return this._store.select<ResponseUserInfo>(state => {
      let user: ResponseUserInfo = _.get(state, 'authentication.user') as unknown as ResponseUserInfo;
      return user;
    });
  }


  setApiKeys(token?: TokenReturn): void {

    console.log(token);
    if (token && token != null) {
      this._accountService.configuration.credentials = {
        'Bearer': `Bearer ${token.access_token}`
      };
      this._storageService.setToken(token).subscribe();
    } else {
      this._accountService.configuration.credentials = {};
      this._storageService.setToken(undefined).subscribe();
      this._storageService.setCurrentUser(undefined).subscribe();
      this._storageService.setCurrentUser(undefined).subscribe();
    }


  }
}
