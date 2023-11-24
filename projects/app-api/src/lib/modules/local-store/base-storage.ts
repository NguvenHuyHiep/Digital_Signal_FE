import { concat, forkJoin, map, Observable, switchMap } from 'rxjs';
import { STORAGE_KEY } from './storage-enum';
import { AppSetting } from '../language/appSetting';
import { BaseOutputString } from '@app-api/lib/api/models/baseOutputString';
import { BaseOutputUser } from '@app-api/lib/api/models/baseOutputUser';

export abstract class BaseStorage implements IBaseStorage {
  public get token(): Observable<BaseOutputString | undefined> {
    return this.get<BaseOutputString | undefined>(STORAGE_KEY.AUTHEN_TOKEN);
  }

  public get currentUser(): Observable<BaseOutputUser | undefined> {
    return this.get<BaseOutputUser | undefined>(STORAGE_KEY.CURRENT_USER);
  }

  get language(): Observable<string | undefined> {
    return this.getAppSetting().pipe(
      map((appSetting) => appSetting?.currentLang)
    );
  }

  public setToken(token?: BaseOutputString): Observable<any> {
    return this.set<BaseOutputString | undefined>(
      STORAGE_KEY.AUTHEN_TOKEN,
      token
    );
  }

  public setCurrentUser(user?: BaseOutputUser): Observable<any> {
    return this.set<BaseOutputUser | undefined>(STORAGE_KEY.CURRENT_USER, user);
  }

  getAppSetting(): Observable<AppSetting | undefined> {
    return this.token.pipe(
      switchMap((token) =>
        this.get<AppSetting | undefined>(STORAGE_KEY.APP_SETTING, 'DEFAULT')
      )
    );
  }

  setAppSetting(appSetting?: AppSetting): Observable<any> {
    return this.token.pipe(
      switchMap((token) => {
        let appSettingId = 'DEFAULT';
        if (appSetting) {
          appSetting.userId = appSettingId;
        }
        return this.set<AppSetting | undefined>(
          STORAGE_KEY.APP_SETTING,
          appSetting,
          appSettingId
        );
      })
    );
  }

  setLanguage(language?: string): Observable<any> {
    return this.getAppSetting().pipe(
      switchMap((appSetting) => {
        if (!appSetting || appSetting == null) {
          appSetting = {};
        }
        appSetting.currentLang = language;
        return this.setAppSetting(appSetting);
      })
    );
  }

  protected abstract get<T>(
    storeName: string,
    key?: string
  ): Observable<T | undefined>;

  protected abstract set<T>(
    storeName: string,
    value: T,
    key?: string
  ): Observable<any>;
}

export interface IBaseStorage {
  get token(): Observable<BaseOutputString | undefined>;

  get currentUser(): Observable<BaseOutputUser | undefined>;

  setToken(token?: BaseOutputString): Observable<any>;

  setCurrentUser(user?: BaseOutputUser): Observable<any>;

  get language(): Observable<string | undefined>;

  setLanguage(language?: string): Observable<any>;
}
