import { Injectable } from '@angular/core';
import { BaseOutputDashBoard } from '@app-api/lib/api/models/baseOutputDashBoard';
import { Observable, of } from 'rxjs';

@Injectable()
export class AdminDashBoardService {
  constructor() {} // private adminDashBoardController: AdminDashBoardControllerService

  public getDashBoardStatictist():
    | Observable<BaseOutputDashBoard>
    | Observable<any> {
    return of([]);
  }
}
