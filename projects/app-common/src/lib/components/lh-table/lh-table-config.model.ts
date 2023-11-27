import { Component, EventEmitter, Input, Output } from '@angular/core';

export enum LhTableFieldType {
  STRING = 'string',
  NUMBER = 'number',
  CURRENCY = 'currency',
  DATE = 'date',
  HTML = 'html',
  DATE_TIME = 'datetime',
  SIZE_MEGABYTE = 'size_megabyte',
}

export interface LhTableConfigModel {
  key: string;
  pagination?: LhTablePaginationConfigModel;
  fields?: LhTableFieldConfigModel[];
  disableUpdate?: boolean;
  disableDelete?: boolean;
  disableDetail?: boolean;
  disableBreadcrumb?: boolean;
  disableOption?: boolean;
  enablePreview?: boolean;
}

export interface LhTableFieldConfigModel {
  label: string;
  field: string;
  type: LhTableFieldType;
  formatter?: Function;
}

export interface LhTablePaginationConfigModel {
  total: number;
  size: number;
  page: number;
}
