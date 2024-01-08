import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { tap } from 'rxjs/operators';

import { FormDevice } from '@app-admin/app/modules/device-group/components/form-device-group';
import { Device } from '@app-api/lib/api/models/device';
import { Observable } from 'rxjs';
import { BaseOutputString } from '@app-api/lib/api/models/baseOutputString';
import { AdminDeviceApiService } from '@app-api/lib/api/apis/admin/admin-device.api.service';
import { BaseOutputDevice } from '@app-api/lib/api/models/baseOutputDevice';
import { DeviceStatus } from '@app-api/lib/api/models/deviceStatus';

@Injectable()
export class AdminDeviceService {
  constructor(
    private formBuilder: FormBuilder,
    private adminDeviceController: AdminDeviceApiService
  ) {}

  public buildDeviceForm(device?: Device): FormDevice {
    let form = this.formBuilder.group({
      id: [device?.id],
      code: [device?.code],
      name: [device?.name],
      information: [device?.information],
      status: [device?.status],
    }) as FormDevice;

    return form;
  }

  public getDeviceById(id: number): Observable<BaseOutputDevice> {
    return this.adminDeviceController.getById(id);
  }

  public getDeviceByDeviceGroupIdAndByPaging(
    deviceGroupId: number,
    page?: number | 0,
    size?: number | 200,
    sortBy?: string | 'id',
    sortDirection?: string | 'DESC',
    keyword?: string | '',
    status?: DeviceStatus // UNDEFINED to get All
  ) {
    return this.adminDeviceController
      .getByDevigroupIdAndPaging(
        deviceGroupId ?? 0,
        page ?? 0,
        size ?? 100,
        sortBy ?? 'id',
        sortDirection ?? 'desc',
        keyword ?? '',
        status ?? 'UNDEFINED'
      )
      .pipe(tap((response) => console.log('devices', response)));
  }

  public getDeviceByPaging(
    page?: number | 0,
    size?: number | 200,
    sortBy?: string | 'id',
    sortDirection?: string | 'DESC',
    keyword?: string | '',
    status?: DeviceStatus // UNDEFINED to get All
  ) {
    return this.adminDeviceController
      .getByPaging(
        page ?? 0,
        size ?? 100,
        sortBy ?? 'id',
        sortDirection ?? 'desc',
        keyword ?? '',
        status ?? 'UNDEFINED'
      )
      .pipe(tap((response) => console.log('devices', response)));
  }

  public addDevice(device: Device): Observable<BaseOutputDevice> {
    return this.adminDeviceController.create(device);
  }

  public updateDevice(
    id: number,
    device: Device
  ): Observable<BaseOutputDevice> {
    return this.adminDeviceController.update(id, device);
  }

  public deleteDevice(id: number): Observable<BaseOutputString> {
    return this.adminDeviceController.delete(id);
  }

  public deleteByIds(deviceIds: number[]): Observable<BaseOutputString> {
    return this.adminDeviceController.deleteByIds(deviceIds);
  }

  public assignDevicesToDeviceGroup(
    deviceGroupId: number,
    deviceId: number
  ): Observable<BaseOutputDevice> {
    return this.adminDeviceController.assignToDeviceGroup(
      deviceGroupId,
      deviceId
    );
  }

  public removeDevicesFromDeviceGroup(
    deviceGroupId: number,
    deviceIds: number[]
  ): Observable<BaseOutputString> {
    return this.adminDeviceController.removeFromDeviceGroup(
      deviceGroupId,
      deviceIds
    );
  }

  public getDeviceByIdWithLogs(id: number) {
    return this.adminDeviceController
      .getDeviceLogs(id)
      .pipe(tap((response) => console.log('devices with logs', response)));
  }
}
