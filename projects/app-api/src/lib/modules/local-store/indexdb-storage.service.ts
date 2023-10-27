import {Injectable} from '@angular/core';
import {ResponseUserInfo, TokenReturn} from "../../api";
import {BaseStorage} from "./base-storage";
import {concatWith, map, Observable, switchMap} from "rxjs";
import {NgxIndexedDBService} from "ngx-indexed-db";
import {STORAGE_KEY} from "./storage-enum";

@Injectable({
  providedIn: 'root'
})
export class IndexdbStorageService extends BaseStorage {

  constructor(private dbService: NgxIndexedDBService) {
    super();
  }

  protected get<T>(storeName: string, key?: string): Observable<T | undefined> {
    return key ? this.dbService.getByID<T>(storeName, key as string) : this.dbService.getAll<T>(storeName).pipe(
      map(users => users ? users[0] : undefined)
    );
  }

  protected set<T>(storeName: string, value: T, key?: string): Observable<any> {
    if (value && value != null) {
      return key ?  this.dbService.update(storeName, value) : this.dbService.clear(storeName).pipe(
        switchMap( ()=> this.dbService.add(storeName, value))
      );
    }
    return key? this.dbService.deleteByKey(storeName, key) : this.dbService.clear(storeName);
  }
}
