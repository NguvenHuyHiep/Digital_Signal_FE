import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseOutputDeviceGroup } from '../../models/baseOutputDeviceGroup';
import { Observable } from 'rxjs';
import { BaseOutputString } from '../../models/baseOutputString';

@Injectable({
  providedIn: 'root',
})
export class AdminDeviceGroupApiService {
  constructor(private http: HttpClient) {}

  public getById(id: number): Observable<BaseOutputDeviceGroup> {
    return this.http.get<BaseOutputDeviceGroup>(
      `/api/v1/admin/device-group/${id}`,
      {
        params: {
          id,
        },
      }
    );
  }

  public getByPaging(
    page: number,
    size: number,
    sortBy: string,
    sortDirection: string,
    keyword: string,
    status: string
  ): Observable<BaseOutputDeviceGroup> {
    return this.http.get<BaseOutputDeviceGroup>(`/api/v1/admin/device-group`, {
      params: {
        page,
        size,
        sortBy,
        sortDirection,
        keyword,
        status,
      },
    });
  }

  public create(
    deviceGroup: BaseOutputDeviceGroup
  ): Observable<BaseOutputDeviceGroup> {
    return this.http.post<BaseOutputDeviceGroup>(
      `/api/v1/admin/device-group`,
      deviceGroup
    );
  }

  public update(
    id: number,
    deviceGroup: BaseOutputDeviceGroup
  ): Observable<BaseOutputDeviceGroup> {
    return this.http.put<BaseOutputDeviceGroup>(
      `/api/v1/admin/device-group/${id}`,
      {
        params: {
          id,
        },
        body: deviceGroup,
      }
    );
  }

  public delete(id: number): Observable<BaseOutputString> {
    return this.http.delete<BaseOutputString>(
      `/api/v1/admin/device-group/${id}`,
      {
        params: {
          id,
        },
      }
    );
  }

  public deleteByIds(ids: number[]): Observable<BaseOutputString> {
    return this.http.delete<BaseOutputString>(`/api/v1/admin/device-groups`, {
      params: {
        ids,
      },
    });
  }

  public getWithDevices(id: number): Observable<BaseOutputDeviceGroup> {
    return this.http.get<BaseOutputDeviceGroup>(
      `/api/v1/admin/device-group/${id}/devices`,
      {
        params: {
          id,
        },
      }
    );
  }

  public assignDevices(
    id: number,
    deviceIds: number[]
  ): Observable<BaseOutputDeviceGroup> {
    return this.http.put<BaseOutputDeviceGroup>(
      `/api/v1/admin/device-group/${id}/devices`,
      {
        params: {
          id,
        },
        body: deviceIds,
      }
    );
  }

  public removeDevices(
    id: number,
    deviceIds: number[]
  ): Observable<BaseOutputDeviceGroup> {
    return this.http.put<BaseOutputDeviceGroup>(
      `/api/v1/admin/device-group/${id}/remove-devices`,
      {
        params: {
          id,
        },
        body: deviceIds,
      }
    );
  }

  public assignToPlaylist(
    deviceGroupId: number,
    playlistId: number
  ): Observable<BaseOutputDeviceGroup> {
    return this.http.put<BaseOutputDeviceGroup>(
      `/api/v1/admin/device-group/${deviceGroupId}/playlist/${playlistId}`,
      {
        params: {
          deviceGroupId,
          playlistId,
        },
      }
    );
  }

  public removeFromPlaylist(
    playlistId: number,
    deviceGroupIds: number[]
  ): Observable<BaseOutputDeviceGroup> {
    return this.http.put<BaseOutputDeviceGroup>(
      `/api/v1/admin/playlist/${playlistId}/device-groups`,
      {
        params: {
          playlistId,
        },
        body: deviceGroupIds,
      }
    );
  }
}
