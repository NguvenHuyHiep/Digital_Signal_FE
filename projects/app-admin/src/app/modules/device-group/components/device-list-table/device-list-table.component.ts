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
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ColumnItem } from '@app-api/lib/api/models/columnItem';

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
  loading: {
    adding: boolean;
    searching: boolean;
    device: boolean;
  } = {
    adding: false,
    searching: false,
    device: false,
  };

  tableColumns: ColumnItem<Device>[] = [
    {
      name: 'ID',
      key: 'id',
    },
    {
      name: 'module.device.code',
      key: 'code',
    },
    {
      name: 'module.device.name',
      key: 'name',
    },
    {
      name: 'module.device.info',
      key: 'information',
    },
    {
      name: 'module.device.status',
      key: 'status',
    },
  ];

  total: number = 0;
  pageIndex: number = 1;
  pageSize: number = 10;
  devices: Device[] = [];
  currentDevice: Device = {};

  constructor(
    private adminDeviceService: AdminDeviceService,
    private adminDeviceGroupService: AdminDeviceGroupService,
    private translateService: TranslateService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.getDeviceListsByPaging(this.pageIndex - 1, this.pageSize);
  }

  getDeviceListsByPaging(
    pageIndex?: number,
    pageSize?: number,
    sortBy?: string,
    sortDirection?: string,
    keyword?: string
  ) {
    this.loading.searching = true;
    if (this.deviceGroup) {
      this.adminDeviceGroupService
        .getDeviceGroupWithDevicesById(this.deviceGroup.id as number)
        .subscribe({
          next: (response) => {
            if (response && response.status === ResponseStatus.Success) {
              this.devices = response.data?.devices as Array<Device>;
              this.total = response.total as number;
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
            this.loading.searching = false;
          },
          complete: () => {
            this.loading.searching = false;
          },
        });
    }
  }

  onQueryParamsChange(params: NzTableQueryParams) {
    console.log('params:', params);
    const { pageIndex, pageSize, sort, filter } = params;
    const { key, value } = sort?.find((s) => s.value) || {};
    this.getDeviceListsByPaging(
      pageIndex - 1,
      pageSize,
      key,
      value?.replace(/end$/, '')
    );
  }
}
