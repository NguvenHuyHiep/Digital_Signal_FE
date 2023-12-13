import { Injectable } from '@angular/core';
import { AdminDashBoardControllerService } from '@app-api/lib/api/controller/adminDashboardController.service';
import { BaseOutputDashBoard } from '@app-api/lib/api/models/baseOutputDashBoard';
import { Observable } from 'rxjs';

@Injectable()
export class AdminDashBoardService {
  constructor(
    private adminDashBoardController: AdminDashBoardControllerService
  ) {}

  public getDashBoardStatictist():
    | Observable<BaseOutputDashBoard>
    | Observable<any> {
    return this.adminDashBoardController.getDashBoardStatictist();
  }
}
