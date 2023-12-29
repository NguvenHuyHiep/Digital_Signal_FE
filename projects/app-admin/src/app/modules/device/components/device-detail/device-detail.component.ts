import { DeviceLog } from '@app-api/lib/api/models/deviceLog';
import { AdminDeviceService } from '@app-api/lib/modules/admin/admin-device/admin-device.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceStatus } from '@app-api/lib/api/models/deviceStatus';
import { Chart } from '@antv/g2';
import { Schedule } from '@app-api/lib/api/models/schedule';
import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { LhTableComponent } from '@app-common/lib/components/lh-table/lh-table.component';
import { Location } from '@angular/common';
import {
  NzTableFilterFn,
  NzTableFilterList,
  NzTableQueryParams,
  NzTableSortFn,
  NzTableSortOrder,
} from 'ng-zorro-antd/table';
import { TranslateService } from '@ngx-translate/core';
import { ColumnItem } from '@app-api/lib/api/models/columnItem';

@Component({
  selector: 'app-admin-device-detail',
  templateUrl: './device-detail.component.html',
  styleUrls: ['./device-detail.component.scss'],
})
export class DeviceDetailComponent {
  deviceId?: number;

  loading: {
    searching: boolean;
  } = {
    searching: false,
  };

  totalDeviceLogs: number = 0;
  pageIndexDeviceLogs: number = 1;
  pageSizeDeviceLogs: number = 10;

  tableColumns: ColumnItem<DeviceLog>[] = [
    {
      name: 'ID',
      key: 'id',
    },
    {
      name: 'module.device.status',
      key: 'status',
    },
    {
      name: 'module.device.update-date',
      key: 'updateDate',
    },
  ];

  deviceLogs: DeviceLog[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    this.deviceId = this.activatedRoute.snapshot.params['deviceId'];
  }

  handleDeviceLogsEventEmitter(deviceLogs: DeviceLog[]): void {
    this.deviceLogs = deviceLogs;
  }

  navigateToDetail = (record: Schedule): void => {
    console.log(record);
    this.router.navigate(['./detail', record.id], {
      relativeTo: this.activatedRoute,
    });
  };

  navigateToPrevious() {
    this.location.back();
  }

  onQueryParamsChangeDeviceLogs(params: NzTableQueryParams) {
    console.log('params:', params);
    const { pageIndex, pageSize, sort, filter } = params;
    const { key, value } = sort?.find((s) => s.value) || {};
  }
}
