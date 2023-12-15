import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseOutputDashBoardResponse } from '../../models/baseOutputDashBoardResponse';

@Injectable({
  providedIn: 'root',
})
export class AdminDashboardApiService {
  constructor(private http: HttpClient) {}

  public getDashBoard(): Observable<BaseOutputDashBoardResponse> {
    return this.http.get<BaseOutputDashBoardResponse>(
      `/api/v1/admin/dashboard`
    );
  }
}
