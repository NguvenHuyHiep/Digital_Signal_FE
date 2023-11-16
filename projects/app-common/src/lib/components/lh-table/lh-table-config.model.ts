import { Component, EventEmitter, Input, Output } from '@angular/core';

export enum LhTableFieldType {
  STRING = 'string',
  NUMBER = 'number',
  CURRENCY = 'currency',
  DATE = 'date',
  HTML = 'html',
  DATE_TIME = 'datetime',
  SIZE_MEGABYTE = 'size_megabyte'
}

export interface LhTableConfigModel {
  key: string;
  fields?: LhTableFieldConfigModel[];
  disableUpdate?: boolean;
  disableDelete?: boolean;
  disableDetail?: boolean;
}

export interface LhTableFieldConfigModel {
  label: string;
  field: string;
  type: LhTableFieldType;
  formatter?: Function;
}
