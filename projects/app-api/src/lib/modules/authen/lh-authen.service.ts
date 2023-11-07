import {Inject, Injectable} from '@angular/core';
import {filter, map, Observable, of} from "rxjs";

import {LH_API_VERSION} from "../../../public-api";
import {LhStorageService} from "../local-store/lh-storage.service";
import {Store} from "@ngrx/store";
import * as _ from 'lodash';
import {tap} from "rxjs/operators";
import {SIGN_IN_FAILED, SIGN_IN_SUCCESS} from "./store/authen.reducers";
import {AuthenticationControllerService} from "../../api/controller/authenticationController.service";
import {BaseOutputString} from "../../api/models/baseOutputString";
import {AdminUsersAPIService} from "../../api/controller/adminUsersAPI.service";
import {BaseOutputUser} from "../../api/models/baseOutputUser";
import {User} from "../../api/models/user";


@Injectable({
  providedIn: 'root'
})
export class LhAuthenService {

  constructor(
    private authenticationService: AuthenticationControllerService,
    private adminUsersAPIService: AdminUsersAPIService,
    private _storageService: LhStorageService,
    private _store: Store,
    @Inject(LH_API_VERSION) private apiVersion: string
  ) {
  }


  public login(username: string, password: string): Observable<BaseOutputString> {
    let login: any = {
      userName: username
      , password: password
    };

    return this.authenticationService.login({
      email:username, password: password
    }).pipe(
      tap((response) => {
        if (response.message && response.message != '' && response.data == null) {
          this._store.dispatch(SIGN_IN_FAILED({value: response}))
        } else if (response != null) {
          this._store.dispatch(SIGN_IN_SUCCESS({value: response}))
        }
      })
    );
  }

  public userInfo(id?: number): Observable<BaseOutputUser> {
    return this.adminUsersAPIService.getById(id as number);
  }



  public isAuthenObs(): Observable<boolean> {
    return this._store.select(state => _.get(state, 'authentication')).pipe(
      filter((a: any) => _.get(a, 'initAuthen'), false),
      map(a => {
        return _.get(a, 'authenticated', false);
      }));
  }

  public get userObs(): Observable<User> {
    return this._store.select<User>(state => {
      let user: User = _.get(state, 'authentication.user') as unknown as User;
      return user;
    });
  }


  setApiKeys(token?: BaseOutputString): void {

    console.log(token);
    if (token && token != null) {
      this.authenticationService.configuration.credentials = {
        'Bearer': `Bearer ${token.data}`
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
