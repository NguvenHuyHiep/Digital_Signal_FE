import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Device } from 'projects/app-api/src/lib/api/models/device';
import { DeviceGroup } from 'projects/app-api/src/lib/api/models/deviceGroup';
import { AdminDeviceService } from 'projects/app-api/src/lib/modules/admin/admin-device/admin-device.service';
import { AdminDeviceGroupService } from 'projects/app-api/src/lib/modules/admin/group-device/admin-group-device.service';
import {
  LhTableConfigModel,
  LhTableFieldType,
} from 'projects/app-common/src/lib/components/lh-table/lh-table-config.model';
import { LhTableComponent } from 'projects/app-common/src/lib/components/lh-table/lh-table.component';

@Component({
  selector: 'app-admin-device-list-table',
  templateUrl: './device-list-table.component.html',
  styleUrls: ['./device-list-table.component.scss'],
})
export class DeviceListTableComponent<T extends Object> {
  @ViewChild('table') table?: LhTableComponent<Device>;
  @Input() deviceGroup?: DeviceGroup;
  @Output() onGroup: EventEmitter<T> = new EventEmitter<T>();
  tableConfig: LhTableConfigModel = {
    key: 'id',
    disableDetail: true,
    disableUpdate: true,
    disableDelete: true,
    fields: [
      {
        label: 'ID',
        field: 'id',
        type: LhTableFieldType.STRING,
      },
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

  devices: Device[] = [];
  currentDevice: Device = {};

  constructor(
    private adminDeviceService: AdminDeviceService,
    private adminDeviceGroupService: AdminDeviceGroupService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    console.log('The device groupId is: ', this.deviceGroup);
    if (this.deviceGroup) {
      this.adminDeviceGroupService
        .getDeviceGroupByDeviceGroupId(this.deviceGroup.id as number)
        .subscribe({
          next: (response) => {
            if (response.data) {
              this.devices = response.data.devices as Array<Device>;
            }
          },
          error: (err) => {
            //TODO Xử lý exception
            this.message.error('Error', err);
          },
          complete: () => {},
        });
    }
  }
}
