import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { tr } from 'date-fns/locale';
import { Device } from 'projects/app-api/src/lib/api/models/device';
import { AdminDeviceService } from 'projects/app-api/src/lib/modules/admin/admin-device/admin-device.service';
import {
  LhTableConfigModel,
  LhTableFieldType,
} from 'projects/app-common/src/lib/components/lh-table/lh-table-config.model';
import { LhTableComponent } from 'projects/app-common/src/lib/components/lh-table/lh-table.component';
import { DeviceGroup } from '../../../../../../../../scripts/projects/app-api/src/lib/api/models/deviceGroup';
import { AdminDeviceGroupService } from '../../../../../../../app-api/src/lib/modules/admin/group-device/admin-group-device.service';

@Component({
  selector: 'app-admin-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss'],
  providers: [AdminDeviceGroupService],
})
export class DeviceListComponent<T extends Object> implements OnInit {
  @ViewChild('table') table?: LhTableComponent<Device>;
  @Input() deviceGroupAdmin?: DeviceGroup;
  @Output() onGroup: EventEmitter<T> = new EventEmitter<T>();
  showFrame: {
    detail: boolean;
    search: boolean;
    add: boolean;
  } = {
    detail: false,
    search: true,
    add: false,
  };

  loading: {
    detail: boolean;
    adding: boolean;
    searching: boolean;
  } = {
    detail: false,
    adding: false,
    searching: false,
  };

  tableConfig: LhTableConfigModel = {
    key: 'id',
    disableDetail: true,
    disableUpdate: false,
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
  currenetDevice: Device = {};

  constructor(
    private adminDeviceService: AdminDeviceService,
    private adminDeviceGroupService: AdminDeviceGroupService
  ) {}

  ngOnInit(): void {
    this.loading.searching = true;
    if (this.deviceGroupAdmin) {
      this.adminDeviceGroupService
        .getDevices(this.deviceGroupAdmin.id as number)
        .subscribe({
          next: (response) => {
            if (response.data) {
              this.devices = response.data.devices as Array<Device>;
            }
          },
          error: (err) => {
            //TODO Xử lý exception
          },
          complete: () => {
            this.loading.searching = false;
          },
        });
    } else {
      this.adminDeviceService.getAllDevice().subscribe({
        next: (response) => {
          if (response && response.data) {
            this.devices = response.data;
          }
        },
        error: (err) => {
          //TODO Xử lý exception
        },
        complete: () => {
          this.loading.searching = false;
        },
      });
    }
  }

  showUpdate(record: Device) {
    this.currenetDevice = record;
    this.showFrame = {
      detail: true,
      search: false,
      add: false,
    };
  }
}
