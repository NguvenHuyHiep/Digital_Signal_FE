import { Injectable } from '@angular/core';
import { BaseStorage, IBaseStorage } from './base-storage';
import { Observable } from 'rxjs';
import { IndexdbStorageService } from './indexdb-storage.service';
import { STORAGE_TYPE } from './storage-enum';
import { BaseOutputString } from '@app-api/lib/api/models/baseOutputString';

@Injectable({
  providedIn: 'root',
})
export class LhStorageService implements IBaseStorage {
  private instance: BaseStorage;

  constructor(private indexDb: IndexdbStorageService) {
    this.instance = indexDb;
    this.changeType(STORAGE_TYPE.INDEXDB);
  }

  public get language(): Observable<string | undefined> {
    return this.instance.language;
  }

  public get currentUser(): Observable<any | undefined> {
    return this.instance.currentUser;
  }

  public get token(): Observable<BaseOutputString | undefined> {
    return this.instance.token;
  }

  public setLanguage(language?: string): Observable<any> {
    return this.instance.setLanguage(language);
  }

  public changeType(type: STORAGE_TYPE) {
    this.instance = this.indexDb;
  }

  public setToken(token?: BaseOutputString) {
    return this.instance.setToken(token);
  }

  public setCurrentUser(user?: any): Observable<any> {
    return this.instance.setCurrentUser(user);
  }
}
