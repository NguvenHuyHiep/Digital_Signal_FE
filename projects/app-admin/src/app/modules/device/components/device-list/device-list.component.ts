import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnItem } from '@app-api/lib/api/models/columnItem';
import { Device } from '@app-api/lib/api/models/device';
import { DeviceGroup } from '@app-api/lib/api/models/deviceGroup';
import { DeviceStatus } from '@app-api/lib/api/models/deviceStatus';
import { ResponseStatus } from '@app-api/lib/api/models/responseStatus';
import { AdminDeviceService } from '@app-api/lib/modules/admin/admin-device/admin-device.service';
import { AdminDeviceGroupService } from '@app-api/lib/modules/admin/group-device/admin-group-device.service';
import {
  LhTableConfigModel,
  LhTableFieldType,
} from '@app-common/lib/components/lh-table/lh-table-config.model';
import { LhTableComponent } from '@app-common/lib/components/lh-table/lh-table.component';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

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

  statusOptions: { label: string; value: string }[] = [
    { label: 'common.all', value: DeviceStatus.Undefined },
    { label: 'common.online', value: DeviceStatus.Online },
    { label: 'common.offline', value: DeviceStatus.Offline },
  ];
  statusSelect: DeviceStatus = DeviceStatus.Undefined;

  loading: {
    detail: boolean;
    adding: boolean;
    searching: boolean;
  } = {
    detail: false,
    adding: false,
    searching: false,
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

  devices: Device[] = [];
  currentDevice: Device = {};
  total: number = 0;
  pageIndex: number = 1;
  pageSize: number = 10;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private adminDeviceService: AdminDeviceService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {}

  navigateToDetail = (record: Device): void => {
    console.log(record);
    this.router.navigate(['./detail', record.id], {
      relativeTo: this.activatedRoute,
    });
  };

  onStatusChange(selectedValue: string): void {
    if (this.statusSelect === selectedValue) {
      this.ngOnInit();
    }
  }

  expandSet = new Set<number>();

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  getDeviceByPaging(
    pageIndex?: number,
    pageSize?: number,
    sortBy?: string,
    sortDirection?: string,
    keyword?: string,
    status?: DeviceStatus
  ): void {
    this.loading.searching = true;
    this.adminDeviceService
      .getDeviceByPaging(
        pageIndex || 0,
        pageSize || 10,
        sortBy || 'id',
        sortDirection || 'desc',
        keyword || '',
        status
      )
      .subscribe({
        next: (response) => {
          if (response && response.data) {
            this.devices = response.data;
            this.total = response.total || 0;
          }
        },
        error: (err) => {
          this.loading.searching = false;
          // TODO i18n
          this.message.error('Error', err);
          this.devices = [];
        },
        complete: () => {
          console.log(this.devices);
          this.loading.searching = false;
        },
      });
  }

  onQueryParamsChange(params: NzTableQueryParams) {
    console.log('params:', params);
    const { pageIndex, pageSize, sort, filter } = params;
    const { key, value } = sort?.find((s) => s.value) || {};
    this.getDeviceByPaging(
      pageIndex - 1,
      pageSize,
      key,
      value?.replace(/end$/, '')
    );
  }
}
