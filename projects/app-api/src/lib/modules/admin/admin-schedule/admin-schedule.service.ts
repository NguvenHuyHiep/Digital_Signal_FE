import { Injectable } from '@angular/core';
import { AdminScheduleAPIService } from '../../../api/controller/adminScheduleAPI.service';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class AdminScheduleService {
  constructor(
    private formBuider: FormBuilder,
    private adminScheduleServiceController: AdminScheduleAPIService
  ) {}

  public getAll = (
    page?: number | 0,
    size?: number | 100,
    sortBy?: string | 'id',
    sortDirection?: string | 'desc'
  ) => {
    return this.adminScheduleServiceController.getByPaging2(
      page,
      size,
      sortBy,
      sortDirection
    );
  };
}
