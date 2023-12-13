import { DashBoardStatictist } from './dashBoardStatictist';
import { ResponseStatus } from './responseStatus';

export interface BaseOutputDashBoard {
  errors?: Array<string>;
  message?: string;
  currentPage?: number;
  pageSize?: number;
  totalPages?: number;
  total?: number;
  status?: ResponseStatus;
  data?: DashBoardStatictist;
}
