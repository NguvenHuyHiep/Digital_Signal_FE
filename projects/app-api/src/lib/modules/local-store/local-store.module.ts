import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DBConfig, NgxIndexedDBModule} from "ngx-indexed-db";
import {STORAGE_KEY} from "./storage-enum";
import {LhStorageService} from "./lh-storage.service";


const dbConfig: DBConfig = {
  name: 'DigitalSignage',
  version: 1,
  objectStoresMeta: [
    {
      store: STORAGE_KEY.AUTHEN_TOKEN,
      storeConfig: {keyPath: 'data', autoIncrement: false},
      storeSchema: [
        {name: 'data', keypath: 'data', options: {unique: true}}
        ,{name: 'message', keypath: 'message', options: {unique: true}}
      ]
    },
    {
      store: STORAGE_KEY.APP_SETTING,
      storeConfig: {keyPath: 'userId', autoIncrement: false},
      storeSchema: [
        {name: 'currentLang', keypath: 'currentLang', options: {unique: false}},
        {name: 'userId', keypath: 'userId', options: {unique: true}}
      ]
    },
    {
      store: STORAGE_KEY.CURRENT_USER,
      storeConfig: {keyPath: 'id', autoIncrement: false},
      storeSchema: [
        {name: 'id', keypath: 'id', options: {unique: true}},
        {name: 'email', keypath: 'email', options: {unique: false}},
        {name: 'phone', keypath: 'phone', options: {unique: false}},
        {name: 'firstName', keypath: 'firstName', options: {unique: false}},
        {name: 'lastName', keypath: 'lastName', options: {unique: false}}
      ]
    }
  ]
};


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgxIndexedDBModule.forRoot(dbConfig)
  ],
  providers: [
    LhStorageService
  ]
})
export class LocalStoreModule {
  public static forRoot(): ModuleWithProviders<LocalStoreModule> {
    return {
      ngModule: LocalStoreModule,
      providers: [LhStorageService]
    };
  }
}
