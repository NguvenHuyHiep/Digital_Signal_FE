import {concat, forkJoin, map, Observable, switchMap} from "rxjs";
import {ResponseUserInfo, TokenReturn} from "../../api";
import {STORAGE_KEY} from "./storage-enum";
import {AppSetting} from "../language/appSetting";

export abstract class BaseStorage implements IBaseStorage {

  public get token(): Observable<TokenReturn | undefined> {
    return this.get<TokenReturn | undefined>(STORAGE_KEY.AUTHEN_TOKEN);
  }

  public get currentUser(): Observable<ResponseUserInfo | undefined> {
    return this.get<ResponseUserInfo | undefined>(STORAGE_KEY.CURRENT_USER);
  }

  get language(): Observable<string | undefined> {
    return this.getAppSetting().pipe(
      map(appSetting => appSetting?.currentLang)
    );
  }

  public setToken(token?: TokenReturn): Observable<any> {
    return this.set<TokenReturn | undefined>(STORAGE_KEY.AUTHEN_TOKEN, token);
  }

  public setCurrentUser(user?: ResponseUserInfo): Observable<any> {
    return this.set<ResponseUserInfo | undefined>(STORAGE_KEY.CURRENT_USER, user);
  }

  getAppSetting(): Observable<AppSetting | undefined> {
    return this.token.pipe(
      switchMap(token => this.get<AppSetting | undefined>(STORAGE_KEY.APP_SETTING, token?.userid || 'DEFAULT'))
    );
  }

  setAppSetting(appSetting?: AppSetting): Observable<any> {
    return this.token.pipe(
      switchMap(token => {
        let appSettingId =  token?.userid || 'DEFAULT';
        if(appSetting){
          appSetting.userId = appSettingId;
        }
        return this.set<AppSetting | undefined>(STORAGE_KEY.APP_SETTING, appSetting, appSettingId);
      })
    );

  }

  setLanguage(language?: string): Observable<any> {
    return this.getAppSetting().pipe(
      switchMap(appSetting => {
        if (!appSetting || appSetting == null) {
          appSetting = {}
        }
        appSetting.currentLang = language;
        return this.setAppSetting(appSetting);
      }),
    );
  }

  protected abstract get<T>(storeName: string, key?: string): Observable<T | undefined>;

  protected abstract set<T>(storeName: string, value: T, key?: string): Observable<any>;
}

export interface IBaseStorage {

  get token(): Observable<TokenReturn | undefined>;

  get currentUser(): Observable<ResponseUserInfo | undefined>;

  setToken(token?: TokenReturn): Observable<any>;

  setCurrentUser(user?: ResponseUserInfo): Observable<any>;

  get language(): Observable<string | undefined>;

  setLanguage(language?: string): Observable<any>;

}

