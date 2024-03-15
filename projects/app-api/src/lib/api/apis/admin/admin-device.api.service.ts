import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseOutputDevice } from '../../models/baseOutputDevice';
import { Observable } from 'rxjs';
import { BaseOutputString } from '../../models/baseOutputString';
import { BaseOutputListDevice } from '../../models/baseOutputListDevice';
import { Device } from '../../models/device';

@Injectable({
  providedIn: 'root',
})
export class AdminDeviceApiService {
  constructor(private http: HttpClient) {}

  public getById(id: number): Observable<BaseOutputDevice> {
    return this.http.get<BaseOutputDevice>(`/api/v1/admin/device/${id}`, {
      params: {
        id,
      },
    });
  }

  getByDevigroupIdAndPaging(
    deviceGroupId: number,
    page: number,
    size: number,
    sortBy: string,
    sortDirection: string,
    keyword: string,
    status: string
  ): Observable<BaseOutputListDevice> {
    return this.http.get<BaseOutputListDevice>(
      `/api/v1/admin/device/device-group/${deviceGroupId}`,
      {
        params: {
          page,
          size,
          sortBy,
          sortDirection,
          keyword,
          status,
        },
      }
    );
  }

  getByPaging(
    page: number,
    size: number,
    sortBy: string,
    sortDirection: string,
    keyword: string,
    status: string
  ): Observable<BaseOutputListDevice> {
    return this.http.get<BaseOutputListDevice>(`/api/v1/admin/device`, {
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

  public create(device: Device): Observable<BaseOutputDevice> {
    return this.http.post<BaseOutputDevice>('/api/v1/admin/device', device);
  }

  public update(id: number, device: Device): Observable<BaseOutputDevice> {
    return this.http.put<BaseOutputDevice>(
      `/api/v1/admin/device/${id}`,
      device
    );
  }

  public delete(id: number): Observable<BaseOutputString> {
    return this.http.delete<BaseOutputString>(`/api/v1/admin/device/${id}`, {
      params: {
        id,
      },
    });
  }

  public deleteByIds(deviceIds: number[]): Observable<BaseOutputString> {
    return this.http.delete<BaseOutputString>(
      `/api/v1/admin/device/delete-devices`,
      {
        body: deviceIds,
      }
    );
  }

  public assignToDeviceGroup(
    deviceId: number,
    groupId: number
  ): Observable<BaseOutputDevice> {
    return this.http.put<BaseOutputDevice>(
      `/api/v1/admin/device/${deviceId}/device-group/${groupId}`,
      {
        params: {
          deviceId,
          groupId,
        },
      }
    );
  }

  public removeFromDeviceGroup(
    deviceGroupId: number,
    deviceIds: number[]
  ): Observable<BaseOutputString> {
    return this.http.put<BaseOutputString>(
      `/api/v1/admin/device/remove/device-group/${deviceGroupId}`,
      deviceIds,
      {
        params: {
          deviceGroupId,
        },
      }
    );
  }

  public getDeviceLogs(
    deviceId: number,
    status: string
  ): Observable<BaseOutputDevice> {
    return this.http.get<BaseOutputDevice>(
      `/api/v1/admin/device/${deviceId}/logs`,
      {
        params: {
          status,
        },
      }
    );
  }
}
