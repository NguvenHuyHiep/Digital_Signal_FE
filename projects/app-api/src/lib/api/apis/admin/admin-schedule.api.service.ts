import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseOutputSchedule } from '../../models/baseOutputSchedule';
import { BaseOutputListSchedule } from '../../models/baseOutputListSchedule';
import { Schedule } from '../../models/schedule';
import { BaseOutputString } from '../../models/baseOutputString';

@Injectable({
  providedIn: 'root',
})
export class AdminScheduleApiService {
  constructor(private http: HttpClient) {}

  public getById(id: number): Observable<BaseOutputSchedule> {
    return this.http.get<BaseOutputSchedule>(`/api/v1/admin/schedule/${id}`, {
      params: {
        id,
      },
    });
  }

  public getByPaging(
    page: number,
    size: number,
    sortBy: string,
    sortDirection: string,
    keyword: string
  ): Observable<BaseOutputListSchedule> {
    return this.http.get<BaseOutputListSchedule>(`/api/v1/admin/schedule`, {
      params: {
        page,
        size,
        sortBy,
        sortDirection,
        keyword,
      },
    });
  }

  public create(schedule: Schedule): Observable<BaseOutputSchedule> {
    return this.http.post<BaseOutputSchedule>(
      `/api/v1/admin/schedule`,
      schedule
    );
  }

  public update(
    id: number,
    schedule: Schedule
  ): Observable<BaseOutputSchedule> {
    return this.http.put<BaseOutputSchedule>(
      `/api/v1/admin/schedule/${id}`,
      schedule,
      {
        params: {
          id,
        },
      }
    );
  }

  public delete(id: number): Observable<BaseOutputString> {
    return this.http.delete<BaseOutputString>(`/api/v1/admin/schedule/${id}`, {
      params: {
        id,
      },
    });
  }

  public deleteByIds(scheduleIds: number[]): Observable<BaseOutputString> {
    return this.http.delete<BaseOutputString>(
      `/api/v1/admin/schedule/delete-schedules`,
      {
        body: scheduleIds,
      }
    );
  }

  public getPlaylists(scheduleId: number): Observable<BaseOutputListSchedule> {
    return this.http.get<BaseOutputListSchedule>(
      `/api/v1/admin/schedule/${scheduleId}/playlists`,
      {
        params: {
          scheduleId,
        },
      }
    );
  }

  public assignPlaylists(
    scheduleId: number,
    playlistIds: number[]
  ): Observable<BaseOutputSchedule> {
    return this.http.put<BaseOutputSchedule>(
      `/api/v1/admin/schedule/${scheduleId}/assign-playlists`,
      playlistIds,
      {
        params: {
          scheduleId,
        },
      }
    );
  }

  public getPublicDownload(id: number): Observable<BaseOutputSchedule> {
    return this.http.get<BaseOutputSchedule>(
      `/api/v1/public/schedule/download/${id}`,
      {
        params: {
          id,
        },
      }
    );
  }

  public getDownload(schedulerId: number): Observable<BaseOutputSchedule> {
    return this.http.get<BaseOutputSchedule>(
      `/api/v1/admin/schedule/download/${schedulerId}`,
      {
        params: {
          schedulerId,
        },
      }
    );
  }
}
