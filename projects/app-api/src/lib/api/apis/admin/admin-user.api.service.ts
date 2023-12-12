import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseOutputListUser } from '../../models/baseOutputListUser';

@Injectable({
  providedIn: 'root',
})
export class AdminUserApiService {
  constructor(private http: HttpClient) {}

  public getByPaging(
    page: number,
    size: number,
    sortBy: string,
    sortDirection: string,
    keyword: string
  ): Observable<BaseOutputListUser> {
    return this.http.get<BaseOutputListUser>(`/api/v1/admin/user`, {
      params: {
        page,
        size,
        sortBy,
        sortDirection,
        keyword,
      },
    });
  }
}
