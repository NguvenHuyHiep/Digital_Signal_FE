import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseOutputListUser } from '../../models/baseOutputListUser';
import { User } from '../../models/user';
import { BaseOutputUser } from '../../models/baseOutputUser';
import { BaseOutputString } from '../../models/baseOutputString';

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

  public getById(id: number): Observable<BaseOutputUser> {
    return this.http.get<BaseOutputUser>(`/api/v1/admin/user/${id}`);
  }

  public getByEmail(email: string): Observable<BaseOutputUser> {
    return this.http.get<BaseOutputUser>(`/api/v1/admin/user/email/${email}`);
  }

  public deleteById(id: number): Observable<BaseOutputString> {
    return this.http.delete<BaseOutputString>(`/api/v1/admin/user/${id}`);
  }

  public deleteByIds(ids: number[]): Observable<BaseOutputString> {
    return this.http.delete<BaseOutputString>(`/api/v1/admin/user`, {
      body: ids,
    });
  }

  public create(user: User): Observable<BaseOutputUser> {
    return this.http.post<BaseOutputUser>(`/api/v1/admin/user/`, user);
  }

  public update(id: number, user: User): Observable<BaseOutputUser> {
    return this.http.put<BaseOutputUser>(`/api/v1/admin/user/${id}`, user);
  }
}
