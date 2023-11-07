import { Injectable } from '@angular/core';
import { Device } from '../../../../../../app-admin/src/app/modules/device/components/device/device.interface';
import { FormBuilder } from '@angular/forms';
import {FormDevice} from '../../../../../../app-admin/src/app/modules/device/components/device-type';

@Injectable()
export class AdminDeviceService {
  constructor(private formBuilder: FormBuilder) {}

  public buildDeviceForm(device?: Device): FormDevice {
    let form = this.formBuilder.group({
      id: [device?.id || ''],
      name: [device?.name || ''],
      status: [device?.status || ''],
      activeTime: [device?.activeTime || ''],
      inactiveTime: [device?.inactiveTime || ''],
      license: [device?.license || '']
    }) as FormDevice;

    return form;
  }
}
