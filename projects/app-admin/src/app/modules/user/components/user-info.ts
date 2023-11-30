import { User } from '@app-api/lib/api/models/user';
import { License } from '@app-api/lib/api/models/license';
import { ErrorResponse } from '@app-api/lib/api';

export interface UserInfo {
  user?: User;
  license?: License;
}

export interface UserInfoRes {
  result: UserInfo | null;
  isError?: boolean;
  statusCode?: number;
  message?: string | null;
  errors?: Array<ErrorResponse> | null;
  last_page?: number;
  current_page?: number;
}

export interface ListUserInfoRes {
  result?: Array<UserInfo> | null;
  isError?: boolean;
  statusCode?: number;
  message?: string | null;
  errors?: Array<ErrorResponse> | null;
  last_page?: number;
  current_page?: number;
}
