import { AuthResponse } from './authResponse';
import { ResponseStatus } from './responseStatus';

export interface BaseOutputAuth {
  errors?: Array<string>;
  message?: string;
  currentPage?: number;
  pageSize?: number;
  totalPages?: number;
  total?: number;
  status?: ResponseStatus;
  data?: AuthResponse;
}
