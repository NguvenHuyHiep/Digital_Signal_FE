import { Injectable } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DeviceGroup } from '@app-api/lib/api/models/deviceGroup';
import { BaseOutputDeviceGroup } from '@app-api/lib/api/models/baseOutputDeviceGroup';
import {
  FormDevice,
  FormDeviceGroup,
} from '@app-admin/app/modules/device-group/components/form-device-group';
import { BaseOutputString } from '@app-api/lib/api/models/baseOutputString';
import { Device } from '@app-api/lib/api/models/device';
import { AdminDeviceGroupControllerService } from '@app-api/lib/api';

@Injectable()
export class AdminDeviceGroupService {
  constructor(
    private formBuilder: FormBuilder,
    private adminGroupDeviceController: AdminDeviceGroupControllerService
  ) {}

  public getDeviceGroupByDeviceGroupId(
    deviceGroupId: number
  ): Observable<BaseOutputDeviceGroup> {
    return this.adminGroupDeviceController.getById8(deviceGroupId);
  }

  public getDeviceGroupWithDevicesById(
    deviceGroupId: number
  ): Observable<BaseOutputDeviceGroup> {
    return this.adminGroupDeviceController.getById8(deviceGroupId);
  }

  public buildDeviceGroupForm(deviceGroup?: DeviceGroup): FormDeviceGroup {
    let form = this.formBuilder.group({
      id: [deviceGroup?.id],
      name: [deviceGroup?.name],
      description: [deviceGroup?.description],
    }) as FormDeviceGroup;
    form.addControl('devices', this.formBuilder.array([]) as FormArray);
    deviceGroup?.devices?.forEach((device) => {
      const deviceForm: FormDevice = this.buildDeviceForm(device);
      form.controls.devices?.push(deviceForm);
    });
    return form;
  }

  public getAllDeviceGroup(
    page?: number,
    size?: number,
    sortBy?: string,
    sortDirection?: string,
    keyword?: string
  ) {
    let params = new HttpParams();

    // Thêm các tham số vào HttpParams nếu chúng được cung cấp
    if (page !== undefined && page !== null) {
      params = params.set('page', page.toString());
    }
    if (size !== undefined && size !== null) {
      params = params.set('size', size.toString());
    }
    if (sortBy) {
      params = params.set('sortBy', sortBy);
    }
    if (sortDirection) {
      params = params.set('sortDirection', sortDirection);
    }
    if (keyword) {
      params = params.set('keyword', keyword);
    }
    return this.adminGroupDeviceController
      .getByPaging9(0, 100, 'id', 'DESC')
      .pipe(tap((response) => console.log(response)));
  }

  public deleteDeviceGroup(deviceGroup: number): Observable<BaseOutputString> {
    return this.adminGroupDeviceController.delete9(deviceGroup);
  }

  public addGroupDevice(
    groupDevice: DeviceGroup
  ): Observable<BaseOutputDeviceGroup> {
    return this.adminGroupDeviceController.create6(groupDevice);
  }

  updateGroupDevice(
    groupDevice: DeviceGroup
  ): Observable<BaseOutputDeviceGroup> {
    return this.adminGroupDeviceController.update6(
      groupDevice?.id as number,
      groupDevice
    );
  }

  public assignDevices(deviceGroupId: number, deviceIds: number[]) {
    return this.adminGroupDeviceController.assignDevices(
      deviceGroupId,
      deviceIds
    );
  }

  private buildDeviceForm(device: Device): FormDevice {
    return this.formBuilder.group({
      id: [device.id],
      code: [device.code],
      name: [device.name],
      information: [device.information],
      description: [device.description],
      status: [device.status],
    }) as FormDevice;
  }

  public assignDeviceGroup(playListId: number, deviceGroupIds: number[]) {
    return this.adminGroupDeviceController.assignDevices(
      playListId,
      deviceGroupIds
    );
  }

  removeDeviceGroupFromPlaylist(
    playlistId: number,
    requestBody: number[]
  ): Observable<BaseOutputString> {
    return this.adminGroupDeviceController.removeDeviceGroupsFromPlaylist(
      playlistId,
      requestBody
    );
  }
}
