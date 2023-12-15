import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseOutputLicense } from '../../models/baseOutputLicense';
import { Observable } from 'rxjs';
import { BaseOutputString } from '../../models/baseOutputString';
import { BaseOutputListLicense } from '../../models/baseOutputListLicense';

@Injectable({
  providedIn: 'root',
})
export class AdminLicenseApiService {
  constructor(private http: HttpClient) {}

  public getById(id: number): Observable<BaseOutputLicense> {
    return this.http.get<BaseOutputLicense>(`/api/v1/admin/license/${id}`, {
      params: {
        id,
      },
    });
  }

  public getByPaging(
    page: number,
    size: number,
    sortBy: string,
    sortDirection: string
  ): Observable<BaseOutputListLicense> {
    return this.http.get<BaseOutputListLicense>(`/api/v1/admin/license`, {
      params: {
        page,
        size,
        sortBy,
        sortDirection,
      },
    });
  }

  public delete(id: number): Observable<BaseOutputString> {
    return this.http.delete<BaseOutputString>(`/api/v1/admin/license/${id}`, {
      params: {
        id,
      },
    });
  }

  public generate(
    email: string,
    duration: number
  ): Observable<BaseOutputLicense> {
    return this.http.post<BaseOutputLicense>(`/api/v1/admin/license/generate`, {
      email,
      duration,
    });
  }

  public expand(code: number, duration: number): Observable<BaseOutputLicense> {
    return this.http.post<BaseOutputLicense>(`/api/v1/admin/license/expand`, {
      code,
      duration,
    });
  }

  public updateByUser(
    userId: number,
    licenseId: number
  ): Observable<BaseOutputLicense> {
    return this.http.post<BaseOutputLicense>(`/api/v1/admin/license/assign`, {
      userId,
      licenseId,
    });
  }
}
