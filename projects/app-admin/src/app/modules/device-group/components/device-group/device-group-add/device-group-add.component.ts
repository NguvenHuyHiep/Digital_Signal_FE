import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseOutputDeviceGroup } from '../../../../../../../../app-api/src/lib/api/models/baseOutputDeviceGroup';
import { DeviceGroup } from '../../../../../../../../app-api/src/lib/api/models/deviceGroup';
import { Device } from '../../../../../../../../app-api/src/lib/api/models/device';
import { User } from '../../../../../../../../app-api/src/lib/api/models/user';
import { AdminDeviceGroupService } from '../../../../../../../../app-api/src/lib/modules/admin/group-device/admin-group-device.service';
import { FormDevice, FormDeviceGroup } from '../../form-device-group';
import {
  LhTableConfigModel,
  LhTableFieldType,
} from '../../../../../../../../app-common/src/lib/components/lh-table/lh-table-config.model';
import { AdminDeviceControllerService } from '../../../../../../../../app-api/src/lib/api/controller/adminDeviceController.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable } from 'rxjs';
import { AdminDeviceService } from '../../../../../../../../app-api/src/lib/modules/admin/admin-device/admin-device.service';
import { Location } from '@angular/common';
import { ResponseStatus } from '../../../../../../../../app-api/src/lib/api/models/responseStatus';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-device-group-add',
  templateUrl: './device-group-add.component.html',
  styleUrls: ['./device-group-add.component.scss'],
  providers: [AdminDeviceService],
})
export class DeviceGroupAddComponent implements OnInit {
  deviceId?: number;
  devices: Device[] = [];
  currentDevice: Device = {};

  deviceGroupId?: number;
  currentDeviceGroup?: DeviceGroup;

  loading: {
    addDevice: boolean;
    deleteDevices: boolean;
    searching: boolean;
  } = {
    searching: false,
    deleteDevices: false,
    addDevice: false,
  };

  tableConfig: LhTableConfigModel = {
    key: 'id',
    disableDetail: true,
    disableUpdate: false,
    disableDelete: true,
    fields: [
      {
        label: 'module.device.code',
        field: 'code',
        type: LhTableFieldType.STRING,
      },
      {
        label: 'module.device.name',
        field: 'name',
        type: LhTableFieldType.STRING,
      },
      {
        label: 'module.device.info',
        field: 'information',
        type: LhTableFieldType.STRING,
      },
      {
        label: 'module.device.status',
        field: 'status',
        type: LhTableFieldType.STRING,
      },
    ],
  };

  form: FormDeviceGroup = this.adminDeviceGroupService.buildDeviceGroupForm(
    this.currentDeviceGroup
  );

  addDeviceForm: FormDevice = this.formBuilder.group({
    deviceId: ['', Validators.required],
  }) as unknown as FormDevice;

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private adminDeviceGroupService: AdminDeviceGroupService,
    private deviceService: AdminDeviceControllerService,
    private message: NzMessageService,
    private translateService: TranslateService
  ) {
    this.deviceGroupId = this.activatedRoute.snapshot.params['deviceGroupId'];
  }

  ngOnInit(): void {
    if (this.deviceGroupId) {
      // update
      this.getDeviceGroupById(this.deviceGroupId);
      this.getDeviceListsByDeviceGroupId(this.deviceGroupId);
    } else {
      // create
    }
  }

  getDeviceGroupById(deviceGroupId: number) {
    this.loading.searching = true;
    this.adminDeviceGroupService
      .getDeviceGroupByDeviceGroupId(deviceGroupId)
      .subscribe({
        next: (response) => {
          if (response && response.status === ResponseStatus.Success) {
            this.currentDeviceGroup = response.data;
            this.form.patchValue(this.currentDeviceGroup as any);
            console.log('ngOnInit', this.form.value);
          } else {
            let errorsInStr: string = response.errors
              ?.map((e) => this.translateService.instant(e))
              .join(', ') as string;
            this.message.error(errorsInStr);
          }
        },
        error: (err) => {},
        complete: () => {
          this.loading.searching = false;
        },
      });
  }
  add() {
    if (!this.form) {
      return;
    }
    this.loading.addDevice = true;
    this.addOrUpdate().subscribe({
      next: (response) => {
        if (response && response.status === ResponseStatus.Success) {
          this.currentDeviceGroup = response.data;
        } else {
          let errorsInStr: string = response.errors
            ?.map((e) => this.translateService.instant(e))
            .join(', ') as string;
          this.message.error(errorsInStr);
        }
      },
      error: (err) => {
        // TODO i18n
        this.message.error('Error', err);
        this.loading.searching = false;
      },
      complete: () => {
        this.loading.addDevice = false;
        this.message.create('success', 'Thêm mới thành công');
        this.location.back();
      },
    });
  }

  addOrUpdate(): Observable<BaseOutputDeviceGroup> {
    if (!this.form.valid) {
      this.form.markAsTouched();
      this.form.markAsDirty();
    }
    if (!this.form.controls.id?.value) {
      let addObj: DeviceGroup = {
        name: this.form.controls.name?.value,
        description: this.form.controls.description?.value,
        devices: this.form.controls.devices?.value as Array<Device>,
        user: this.form.controls.user?.value as User,
      };
      return this.adminDeviceGroupService.addGroupDevice(addObj);
    }
    let updateObj: DeviceGroup = {
      id: this.form.controls.id?.value,
      name: this.form.controls.name?.value,
      description: this.form.controls.description?.value,
      devices: this.form.controls.devices?.value as Array<Device>,
      user: this.form.controls.user?.value as User,
    };
    return this.adminDeviceGroupService.updateGroupDevice(updateObj);
  }

  deleteDevice(device: Device) {
    this.deviceService.delete7(device.id as number).subscribe({
      next: (data) => {
        if (!data) {
          this.devices = this.devices.filter((obj) => obj?.id !== device?.id);
          this.message.create('success', data);
          return;
        }
      },
      error: (err) => {
        // TODO i18n
        this.message.error('Error', err);
        this.loading.searching = false;
      },
      complete: () => {
        this.loading.addDevice = false;
      },
    });
  }

  setCurrentDevice($event: Device) {
    this.currentDevice = $event;
    console.log('this.currentDevice', this.currentDevice);
  }

  addDevice() {
    if (!this.addDeviceForm) {
      return;
    }
    const deviceIdValue = Number(this.addDeviceForm.controls.deviceId?.value);
    this.loading.addDevice = true;
    this.adminDeviceGroupService
      .assignDevices(this.currentDeviceGroup?.id as number, [deviceIdValue])
      .subscribe({
        next: (response) => {
          if (response && response.status === ResponseStatus.Success) {
            this.getDeviceListsByDeviceGroupId(this.deviceGroupId as number);
            return;
          } else {
            let errorsInStr: string = response.errors
              ?.map((e) => this.translateService.instant(e))
              .join(', ') as string;
            this.message.error(errorsInStr);
          }
        },
        error: (err) => {
          // TODO i18n
          this.message.error('Error', err);
          this.loading.searching = false;
        },
        complete: () => {
          this.loading.addDevice = false;
        },
      });
  }

  detailDevice(record: Device) {
    this.currentDevice = record;
  }

  // deleteDevices() {
  //   if (!this.devicesToDelete || this.devicesToDelete.length === 0) {
  //     this.message.warning('No devices selected for deletion.');
  //   }
  //   this.loading.deleteDevices = true;
  //   const deviceIdsToDelete: number[] = this.devicesToDelete.map(device => device.id);
  //   this.deviceService.deleteMultipleDevices(deviceIdsToDelete).subscribe({
  //     next: () => {
  //       this.devices = this.devices.filter(device => !deviceIdsToDelete.includes(device.id));
  //       this.message.success('Devices deleted successfully.');
  //     },
  //     error: err => {
  //       // TODO i18n
  //       this.message.error("Error", err);
  //       this.loading.searching = false;
  //     }
  //     , complete: () => {
  //       this.loading.deleteDevices = false;
  //     }
  //   })
  // }

  navigateToPrevious() {
    this.location.back();
  }

  private getDeviceListsByDeviceGroupId(deviceGroupId: number): void {
    this.loading.searching = true;
    if (deviceGroupId) {
      this.adminDeviceGroupService
        .getDeviceGroupByDeviceGroupId(deviceGroupId as number)
        .subscribe({
          next: (response) => {
            if (response && response.status === ResponseStatus.Success) {
              this.devices = response.data?.devices as Array<Device>;
              console.log(this.devices + 'device');
            }
          },
          error: (err) => {
            // TODO i18n
            this.message.error('Error', err);
            this.loading.searching = false;
          },
          complete: () => {
            this.loading.searching = false;
          },
        });
    }
  }
}
