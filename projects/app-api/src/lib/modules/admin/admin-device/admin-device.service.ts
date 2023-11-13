import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Device } from '../../../api/models/device';
import { FormDevice } from '../../../../../../app-admin/src/app/modules/device-group/components/form-device-group';
import { HttpParams } from '@angular/common/http';
import { AdminDeviceControllerService } from '../../../api/controller/adminDeviceController.service';
import { tap } from 'rxjs/operators';

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
    size?: number | 100,
    sortBy?: string | 'id',
    sortDirection?: string | 'asc',
    keyword?: string | ''
  ) {
    return this.adminDeviceController
      .getByPaging7(page, size, sortBy, sortDirection)
      .pipe(tap((response) => console.log('devices', response)));
  }

  getDeviceByIdWithLogs(id: number) {
    return this.adminDeviceController
      .getByIdWithLogs(id)
      .pipe(tap((response) => console.log('devices with logs', response)));
  }
}
