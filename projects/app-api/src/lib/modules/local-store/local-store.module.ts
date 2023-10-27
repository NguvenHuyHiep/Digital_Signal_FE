import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DBConfig, NgxIndexedDBModule} from "ngx-indexed-db";
import {STORAGE_KEY} from "./storage-enum";
import {LhStorageService} from "./lh-storage.service";
import {Configuration} from "../../api";


const dbConfig: DBConfig = {
  name: 'LearHubDB',
  version: 1,
  objectStoresMeta: [
    {
      store: STORAGE_KEY.AUTHEN_TOKEN,
      storeConfig: {keyPath: 'access_token', autoIncrement: false},
      storeSchema: [
        {name: 'access_token', keypath: 'access_token', options: {unique: true}},
        {name: 'expires_in', keypath: 'expires_in', options: {unique: false}},
        {name: 'message', keypath: 'message', options: {unique: false}},
        {name: 'userName', keypath: 'userName', options: {unique: false}},
        {name: 'displayName', keypath: 'displayName', options: {unique: false}},
        {name: 'userid', keypath: 'userid', options: {unique: false}},
        {name: 'employeeId', keypath: 'employeeId', options: {unique: false}},
        {name: 'tenantId', keypath: 'tenantId', options: {unique: false}},
        {name: 'tenantName', keypath: 'tenantName', options: {unique: false}},
        {name: 'tenantType', keypath: 'tenantType', options: {unique: false}},
        {name: 'avatar', keypath: 'avatar', options: {unique: false}},
        {name: 'isVerified', keypath: 'isVerified', options: {unique: false}}
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
      storeConfig: {keyPath: 'userId', autoIncrement: false},
      storeSchema: [
        {name: 'userId', keypath: 'userId', options: {unique: true}},
        {name: 'tenantId', keypath: 'tenantId', options: {unique: false}},
        {name: 'tenantType', keypath: 'tenantType', options: {unique: false}},
        {name: 'email', keypath: 'email', options: {unique: false}},
        {name: 'userName', keypath: 'userName', options: {unique: false}},
        {name: 'displayName', keypath: 'displayName', options: {unique: false}},
        {name: 'gender', keypath: 'gender', options: {unique: false}},
        {name: 'birthday', keypath: 'birthday', options: {unique: false}},
        {name: 'avatar', keypath: 'avatar', options: {unique: false}},
        {name: 'isVerified', keypath: 'isVerified', options: {unique: false}}
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
