import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { tap } from 'rxjs/operators';

import { FormDevice } from '@app-admin/app/modules/device-group/components/form-device-group';
import { Device } from '@app-api/lib/api/models/device';
import { Observable } from 'rxjs';
import { BaseOutputString } from '@app-api/lib/api/models/baseOutputString';
import { AdminDeviceControllerService } from '@app-api/lib/api';

@Injectable()
export class AdminDeviceService {
  constructor(
    private formBuilder: FormBuilder,
    private adminDeviceController: AdminDeviceControllerService
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

  getAllDevice(
    page?: number | 0,
    size?: number | 200,
    sortBy?: string | 'id',
    sortDirection?: string | 'DESC',
    keyword?: string | '',
    status?: string | 'UNDEFINED' | 'ONLINE' | 'OFFLINE'
  ) {
    return this.adminDeviceController
      .getByPaging7(page, size, sortBy, sortDirection, keyword, status)
      .pipe(tap((response) => console.log('devices', response)));
  }

  getDeviceByIdWithLogs(id: number) {
    return this.adminDeviceController
      .getByIdWithLogs(id)
      .pipe(tap((response) => console.log('devices with logs', response)));
  }

  public removeDevicesFromDeviceGroup(
    deviceGroupId: number,
    deviceIds: number[]
  ): Observable<BaseOutputString> {
    return this.adminDeviceController.removeDevicesFromDeviceGroup(
      deviceGroupId,
      deviceIds
    );
  }
}
