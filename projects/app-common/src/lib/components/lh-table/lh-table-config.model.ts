import {Component, EventEmitter, Input, Output} from '@angular/core';

export enum LhTableFieldType {
  STRING = 'string', NUMBER = 'number', CURRENCY = 'currency', DATE = 'date', HTML = 'html'
}

export interface LhTableConfigModel {
  key: string;
  fields?: LhTableFieldConfigModel[];
  disableUpdate?: boolean;
  disableDelete?: boolean;
}

export interface LhTableFieldConfigModel {
  label: string;
  field: string;
  type: LhTableFieldType;
  formatter?: Function;
}
