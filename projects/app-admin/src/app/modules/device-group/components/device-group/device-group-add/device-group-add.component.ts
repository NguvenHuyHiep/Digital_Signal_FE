import {Component, Input, OnInit} from '@angular/core';
import { FormBuilder, Validators} from "@angular/forms";
import {BaseOutputDeviceGroup} from "../../../../../../../../app-api/src/lib/api/models/baseOutputDeviceGroup";
import {DeviceGroup} from "../../../../../../../../app-api/src/lib/api/models/deviceGroup";
import {Device} from "../../../../../../../../app-api/src/lib/api/models/device";
import {User} from "../../../../../../../../app-api/src/lib/api/models/user";
import {
  AdminDeviceGroupService
} from "../../../../../../../../app-api/src/lib/modules/admin/group-device/admin-group-device.service";
import {FormDevice, FormDeviceGroup} from "../../form-device-group";
import {
  LhTableConfigModel,
  LhTableFieldType
} from "../../../../../../../../app-common/src/lib/components/lh-table/lh-table-config.model";
import {
  AdminDeviceControllerService
} from "../../../../../../../../app-api/src/lib/api/controller/adminDeviceController.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {Observable} from "rxjs";
import {
  AdminDeviceService
} from "../../../../../../../../app-api/src/lib/modules/admin/admin-device/admin-device.service";


@Component({
  selector: 'app-admin-device-group-add',
  templateUrl: './device-group-add.component.html',
  styleUrls: ['./device-group-add.component.scss'],
  providers: [AdminDeviceService]
})
export class DeviceGroupAddComponent implements OnInit {
  @Input('deviceId') deviceId?: number;
  @Input() deviceGroupAdmin?: DeviceGroup;
  devices: Array<Device> = [];
  showFrame: {
    detail: boolean,
  } = {
    detail: false,
  };
  loading: {
    addDevice: boolean;
    searching: boolean;
    device: boolean;
  } = {
    searching: false,
    addDevice: false,
    device: false,
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

  tabs = [{
    code: 'info',
    name: 'module.user.info'
  }
  ];
  form: FormDeviceGroup = this.adminDeviceGroupService.buildDeviceGroupForm(this.deviceGroupAdmin)
  addDeviceForm: FormDevice = this.formBuilder.group({
    deviceId: ['', Validators.required]
  }) as unknown as FormDevice;
  currentDevice: Device = {};

  constructor(
    private formBuilder: FormBuilder,
    private adminDeviceGroupService: AdminDeviceGroupService,
    private deviceService: AdminDeviceControllerService,
    private message: NzMessageService,
  ) {
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
    return this.adminDeviceGroupService.updateGroupDevice(updateObj)
  }

  deleteDevice(device: Device) {
    this.deviceService.delete7(device.id as number).subscribe({
      next: data => {
        if (!data) {
          this.devices = this.devices.filter((obj) => obj?.id !== device?.id);
          this.message.create('success', data);
          return;
        }
      }, error: err => {
        // TODO i18n
        this.message.error("Error", err);
        this.loading.searching = false;
      }, complete: () => {
        this.loading.addDevice = false;
      }
    });
  }

  setCurrentDevice($event: Device) {
    this.currentDevice = $event;
    console.log("this.currentDevice", this.currentDevice)
  }

  addDevice() {
    if (!this.addDeviceForm) {
      return;
    }
    const deviceIdValue = Number(this.addDeviceForm.controls.deviceId?.value);
      this.loading.addDevice = true;
      this.adminDeviceGroupService.assignDevices(this.deviceGroupAdmin?.id as number, [deviceIdValue] ).subscribe({
        next: data => {
          if (data) {
            this.loadDevice();
            return;
          }
        }, error: err => {
          // TODO i18n
          this.message.error("Error", err);
          this.loading.searching = false;
        }
        , complete: () => {
          this.loading.addDevice = false;
        }
      })

  }

  // TODO change position of ngOninit to after constructor
  ngOnInit(): void {
    this.loadDevice()
    if(this.deviceGroupAdmin){
      this.patchValue(this.deviceGroupAdmin)
    }
    this.form.valueChanges.subscribe((value) => console.log('Add Device Group', value));
  }
  private patchValue(obj: DeviceGroup) {
    this.form.patchValue(obj as any);
  }

  private loadDevice(): void {
    this.loading.searching = true;
    if (this.deviceGroupAdmin) {
      this.adminDeviceGroupService.getDevices(this.deviceGroupAdmin?.id as number).subscribe({
        next: (response) => {
          if (response.data) {
            this.devices = response.data.devices as Array<Device>;
            console.log(this.devices + "device");
          }
        }
        , error: err => {
          // TODO i18n
          this.message.error("Error", err);
          this.loading.searching = false;
        }
        , complete: () => {
          this.loading.searching = false;
        }
      });
    }
  }

  detailDevice(record: Device) {
    this.currentDevice = record;
    this.showFrame = {
      detail: true,
    }
  }
}
