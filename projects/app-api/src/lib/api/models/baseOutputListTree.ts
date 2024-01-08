import { ResponseStatus } from './responseStatus';
import { Tree } from './tree';

export interface BaseOutputListTree {
  errors?: Array<string>;
  message?: string;
  currentPage?: number;
  pageSize?: number;
  totalPages?: number;
  total?: number;
  status?: ResponseStatus;
  data: Tree[];
}
