import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { LhTableComponent } from 'projects/app-common/src/lib/components/lh-table/lh-table.component';
import { Device } from '@app-api/lib/api/models/device';
import { DeviceGroup } from '@app-api/lib/api/models/deviceGroup';
import {
  LhTableConfigModel,
  LhTableFieldType,
} from '@app-common/lib/components/lh-table/lh-table-config.model';
import { AdminDeviceService } from '@app-api/lib/modules/admin/admin-device/admin-device.service';
import { AdminDeviceGroupService } from '@app-api/lib/modules/admin/group-device/admin-group-device.service';
import { ResponseStatus } from '@app-api/lib/api/models/responseStatus';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-device-list-table',
  templateUrl: './device-list-table.component.html',
  styleUrls: ['./device-list-table.component.scss'],
})
export class DeviceListTableComponent<T extends Object> {
  @ViewChild('table')
  table?: LhTableComponent<Device>;
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
    private translateService: TranslateService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    console.log('The device groupId is: ', this.deviceGroup);
    if (this.deviceGroup) {
      this.adminDeviceGroupService
        .getDeviceGroupByDeviceGroupId(this.deviceGroup.id as number)
        .subscribe({
          next: (response) => {
            if (response && response.status === ResponseStatus.Success) {
              this.devices = response.data?.devices as Array<Device>;
            } else {
              let errorsInStr: string = response.errors
                ?.map((e) => this.translateService.instant(e))
                .join(',') as string;
              this.message.error(errorsInStr);
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
