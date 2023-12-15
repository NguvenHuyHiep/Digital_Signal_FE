import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AdminScheduleApiService } from '@app-api/lib/api/apis/admin/admin-schedule.api.service';
import { BaseOutputSchedule } from '@app-api/lib/api/models/baseOutputSchedule';
import { BaseOutputString } from '@app-api/lib/api/models/baseOutputString';
import { Schedule } from '@app-api/lib/api/models/schedule';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminScheduleService {
  constructor(
    private formBuider: FormBuilder,
    private adminScheduleServiceController: AdminScheduleApiService
  ) {}

  public getDetailByIdWithPlaylists(id: number) {
    return this.adminScheduleServiceController.getById(id);
  }

  public getAll(
    page?: number | 0,
    size?: number | 100,
    sortBy?: string | 'id',
    sortDirection?: string | 'desc',
    keyword?: string | ''
  ) {
    return this.adminScheduleServiceController.getByPaging(
      page ?? 0,
      size ?? 100,
      sortBy ?? 'id',
      sortDirection ?? 'desc',
      keyword ?? ''
    );
  }

  public addSchedule(schedule: Schedule): Observable<BaseOutputSchedule> {
    return this.adminScheduleServiceController.create(schedule);
  }

  public updateSchedule(
    id: number,
    schedule: Schedule
  ): Observable<BaseOutputSchedule> {
    return this.adminScheduleServiceController.update(id, schedule);
  }

  public deleteSchedule(id: number): Observable<BaseOutputString> {
    return this.adminScheduleServiceController.delete(id);
  }

  public deleteScheduleByIds(
    scheduleIds: number[]
  ): Observable<BaseOutputString> {
    return this.adminScheduleServiceController.deleteByIds(scheduleIds);
  }

  public getPlaylistsByScheduleId(scheduleId: number) {
    return this.adminScheduleServiceController.getPlaylists(scheduleId);
  }

  public assignPlaylists(
    scheduleId: number,
    playlistIds: number[]
  ): Observable<BaseOutputSchedule> {
    return this.adminScheduleServiceController.assignPlaylists(
      scheduleId,
      playlistIds
    );
  }

  public getPublicDownload(id: number): Observable<BaseOutputSchedule> {
    return this.adminScheduleServiceController.getPublicDownload(id);
  }

  public getDownload(schedulerId: number): Observable<BaseOutputSchedule> {
    return this.adminScheduleServiceController.getDownload(schedulerId);
  }
}
