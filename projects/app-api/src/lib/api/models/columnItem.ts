import {
  NzTableFilterFn,
  NzTableFilterList,
  NzTableSortFn,
  NzTableSortOrder,
} from 'ng-zorro-antd/table';

export interface ColumnItem<T> {
  name: string;
  key?: string;
  listOfFilter?: NzTableFilterList;
  filterMultiple?: boolean;
  sortFn?: boolean | NzTableSortFn<T> | null;
}
