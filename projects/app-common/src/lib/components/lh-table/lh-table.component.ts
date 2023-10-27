import {Component, EventEmitter, Input, Output, TemplateRef} from '@angular/core';
import {LhTableConfigModel, LhTableFieldConfigModel, LhTableFieldType} from "./lh-table-config.model";
import * as _ from 'lodash';
import {DatePipe} from "@angular/common";
import {TranslateService} from "@ngx-translate/core";
import {vi_VN} from "ng-zorro-antd/i18n";

@Component({
  selector: 'lh-common-lh-table',
  templateUrl: './lh-table.component.html',
  styleUrls: ['./lh-table.component.css']
})
export class LhTableComponent<T extends Object> {
  @Input() data: T[] = [];
  @Input() loading: boolean = false;
  @Input() config: LhTableConfigModel = {
    key: ''
  };
  @Input() expandTemplate?: TemplateRef<any>;
  @Output() onSearch: EventEmitter<string> = new EventEmitter<string>();
  @Output() onDetail: EventEmitter<T> = new EventEmitter<T>();
  @Output() onUpdate: EventEmitter<T> = new EventEmitter<T>();
  @Output() onDelete: EventEmitter<T> = new EventEmitter<T>();
  expandSet = new Set<number>();
  setOfCheckedId = new Set<string>();

  checked = false;
  indeterminate = false;
  listOfCurrentPageData: readonly T[] = [];

  constructor(private translate: TranslateService
  , private datePipe: DatePipe) {
  }

  getValue(record: any, field: string) {
    return _.get(record, field);
  }

  getDisplayedValue(record: any, field: LhTableFieldConfigModel) {
    let rawValue = _.get(record, field.field);
    if (field.formatter) {
      return field.formatter(rawValue);
    }
    if (field.type === LhTableFieldType.DATE) {
      return this.datePipe.transform(new Date(rawValue), 'dd/MM/yyyy');
    }
    return rawValue;
  }

  getKeyValue(record: any) {
    return this.getValue(record, this.config.key);
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(this.getKeyValue(item)));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(this.getKeyValue(item))) && !this.checked;
  }

  detail(record: T) {
    this.onDetail.emit(record);
  }

  update(record: T) {
    this.onUpdate.emit(record);
  }

  delete(record: T) {
    this.onDelete.emit(record);
  }
}
