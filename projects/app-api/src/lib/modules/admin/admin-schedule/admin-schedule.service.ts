import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AdminScheduleAPIService } from '@app-api/lib/api';

@Injectable({
  providedIn: 'root',
})
export class AdminScheduleService {
  constructor(
    private formBuider: FormBuilder,
    private adminScheduleServiceController: AdminScheduleAPIService
  ) {}

  public getAll(
    page?: number | 0,
    size?: number | 100,
    sortBy?: string | 'id',
    sortDirection?: string | 'desc'
  ) {
    return this.adminScheduleServiceController.getByPaging2(
      page,
      size,
      sortBy,
      sortDirection
    );
  }

  public getDetailByIdWithPlaylists(id: number) {
    return this.adminScheduleServiceController.getWithPlaylistsById(id);
  }
}
