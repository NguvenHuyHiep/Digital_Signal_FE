import { Injectable } from '@angular/core';
import { AdminDashboardApiService } from '@app-api/lib/api/apis/admin/admin-dashboard.api.service';
import { BaseOutputDashBoard } from '@app-api/lib/api/models/baseOutputDashBoard';
import { BaseOutputDashBoardResponse } from '@app-api/lib/api/models/baseOutputDashBoardResponse';
import { Observable, tap } from 'rxjs';

@Injectable()
export class AdminDashBoardService {
  constructor(private adminDashBoardController: AdminDashboardApiService) {} // private adminDashBoardController: AdminDashBoardControllerService

  public getDashBoardStatictist(): Observable<BaseOutputDashBoardResponse> {
    return this.adminDashBoardController
      .getDashBoard()
      .pipe(tap((response) => console.log(response)));
  }
}
