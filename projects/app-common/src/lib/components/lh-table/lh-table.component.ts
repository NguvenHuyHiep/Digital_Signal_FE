import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import {
  LhTableConfigModel,
  LhTableFieldConfigModel,
  LhTableFieldType,
  LhTablePaginationConfigModel,
} from './lh-table-config.model';
import * as _ from 'lodash';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'lh-common-lh-table',
  templateUrl: './lh-table.component.html',
  styleUrls: ['./lh-table.component.css'],
})
export class LhTableComponent<T extends Object> implements OnInit, OnChanges {
  @Input() data: T[] = [];
  @Input() loading: boolean = false;
  @Input() config: LhTableConfigModel = {
    key: '',
  };
  @Input() expandTemplate?: TemplateRef<any>;
  @Output() onSearch: EventEmitter<string> = new EventEmitter<string>();
  @Output() onDetail: EventEmitter<T> = new EventEmitter<T>();
  @Output() onUpdate: EventEmitter<T> = new EventEmitter<T>();
  @Output() onDelete: EventEmitter<T> = new EventEmitter<T>();
  @Output() onPreview: EventEmitter<T> = new EventEmitter<T>();
  expandSet = new Set<number>();
  setOfCheckedId = new Set<string>();

  checked = false;
  indeterminate = false;
  listOfCurrentPageData: readonly T[] = [];

  showData: T[] = this.data;
  pageIndex: number = 1;
  pageSize = 20;
  total = 0;

  constructor(
    private translate: TranslateService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.onPageIndexChange(1);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // handle input data for clientside pagination
    if (!this.config.pagination && changes['data']) {
      this.total = changes['data'].currentValue.length || 0;
      this.onPageIndexChange(this.pageIndex);
    }
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
    if (field.type === LhTableFieldType.DATE_TIME) {
      return this.datePipe.transform(new Date(rawValue), 'dd/MM/yyyy HH:mm');
    }
    if (field.type === LhTableFieldType.SIZE_MEGABYTE) {
      return `${this.formatSize(rawValue)} MB`;
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
    this.checked = this.listOfCurrentPageData.every((item) =>
      this.setOfCheckedId.has(this.getKeyValue(item))
    );
    this.indeterminate =
      this.listOfCurrentPageData.some((item) =>
        this.setOfCheckedId.has(this.getKeyValue(item))
      ) && !this.checked;
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

  preview(record: T) {
    this.onPreview.emit(record);
  }

  onPageIndexChange(newPage: number) {
    this.pageIndex = newPage;
    const startIndex = (this.pageIndex - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize - 1, this.total - 1);
    this.showData = this.data.slice(startIndex, endIndex + 1);
  }

  getTotal() {
    return this.data ? this.data.length : this.total;
  }

  getPageSize() {
    return this.config.pagination ? this.config.pagination.size : this.pageSize;
  }

  getPageIndex() {
    return this.config.pagination
      ? this.config.pagination.page
      : this.pageIndex;
  }

  private formatSize = (sizeInBytes: number) => {
    const megabyte = 1024 * 1024;
    const sizeInMB = sizeInBytes / megabyte;
    return sizeInMB.toFixed(2);
  };
}
