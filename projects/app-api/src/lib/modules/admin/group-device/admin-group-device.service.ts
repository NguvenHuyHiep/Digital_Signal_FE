import { Injectable } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { DeviceGroup } from '@app-api/lib/api/models/deviceGroup';
import { BaseOutputDeviceGroup } from '@app-api/lib/api/models/baseOutputDeviceGroup';
import {
  FormDevice,
  FormDeviceGroup,
} from '@app-admin/app/modules/device-group/components/form-device-group';
import { BaseOutputString } from '@app-api/lib/api/models/baseOutputString';
import { Device } from '@app-api/lib/api/models/device';
import { AdminDeviceGroupApiService } from '@app-api/lib/api/apis/admin/admin-device-group.api.service';
import { assign } from 'lodash';

@Injectable()
export class AdminDeviceGroupService {
  constructor(
    private formBuilder: FormBuilder,
    private adminGroupDeviceController: AdminDeviceGroupApiService
  ) {}

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

  public getDeviceGroupByDeviceGroupId(
    deviceGroupId: number
  ): Observable<BaseOutputDeviceGroup> {
    return this.adminGroupDeviceController.getById(deviceGroupId);
  }

  public getDeviceGroupByPaging(
    page?: number,
    size?: number,
    sortBy?: string,
    sortDirection?: string,
    keyword?: string,
    status?: string
  ) {
    return this.adminGroupDeviceController
      .getByPaging(
        page ?? 0,
        size ?? 100,
        sortBy ?? 'id',
        sortDirection ?? 'desc',
        keyword ?? '',
        status ?? ''
      )
      .pipe(tap((response) => console.log(response)));
  }

  public getDeviceGroupByPlaylistIdAndPaging(
    playlistId?: number,
    page?: number,
    size?: number,
    sortBy?: string,
    sortDirection?: string,
    keyword?: string,
    status?: string
  ) {
    return this.adminGroupDeviceController
      .getByPlaylistIdAndByPaging(
        playlistId ?? 0,
        page ?? 0,
        size ?? 100,
        sortBy ?? 'id',
        sortDirection ?? 'desc',
        keyword ?? '',
        status ?? ''
      )
      .pipe(tap((response) => console.log(response)));
  }

  public addGroupDevice(
    groupDevice: DeviceGroup
  ): Observable<BaseOutputDeviceGroup> {
    return this.adminGroupDeviceController.create(groupDevice);
  }

  public updateGroupDevice(
    groupDevice: DeviceGroup
  ): Observable<BaseOutputDeviceGroup> {
    return this.adminGroupDeviceController.update(
      groupDevice?.id as number,
      groupDevice
    );
  }

  public deleteDeviceGroup(deviceGroup: number): Observable<BaseOutputString> {
    return this.adminGroupDeviceController.delete(deviceGroup);
  }

  public deleteDeviceGroupByIds(
    deviceGroupIds: number[]
  ): Observable<BaseOutputString> {
    return this.adminGroupDeviceController.deleteByIds(deviceGroupIds);
  }

  public getDeviceGroupWithDevicesById(
    deviceGroupId: number
  ): Observable<BaseOutputDeviceGroup> {
    return this.adminGroupDeviceController.getWithDevices(deviceGroupId);
  }

  public assignDevicesToDeviceGroup(
    deviceGroupId: number,
    deviceIds: number[]
  ) {
    return this.adminGroupDeviceController.assignDevices(
      deviceGroupId,
      deviceIds
    );
  }

  public removeDevicesFromDeviceGroup(
    deviceGroupId: number,
    deviceIds: number[]
  ): Observable<BaseOutputString> {
    return this.adminGroupDeviceController.removeDevices(
      deviceGroupId,
      deviceIds
    );
  }

  public assignDeviceGroupToPlaylist(
    playListId: number,
    deviceGroupIds: number[]
  ) {
    return this.adminGroupDeviceController.assignDevices(
      playListId,
      deviceGroupIds
    );
  }

  public removeDeviceGroupFromPlaylist(
    playlistId: number,
    deviceGroupIds: number[]
  ): Observable<BaseOutputString> {
    return this.adminGroupDeviceController.removeFromPlaylist(
      playlistId,
      deviceGroupIds
    );
  }

  public exportDeviceStatus(
    deviceGroupId: number
  ): Observable<Blob | undefined> {
    if (deviceGroupId) {
      return this.adminGroupDeviceController.exportDeviceStatus(deviceGroupId);
    }
    return of(undefined);
  }
}
