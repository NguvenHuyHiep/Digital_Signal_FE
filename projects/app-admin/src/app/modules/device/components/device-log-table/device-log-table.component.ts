import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ColumnItem } from '@app-api/lib/api/models/columnItem';
import { DeviceLog } from '@app-api/lib/api/models/deviceLog';

@Component({
  selector: 'app-admin-device-log-table',
  templateUrl: './device-log-table.component.html',
  styleUrls: ['./device-log-table.component.scss'],
})
export class DeviceLogTableComponent implements OnChanges {
  @Input('isShowOption') isShowOption?: boolean = false;
  @Input('deviceId') deviceId?: number;
  @Input('deviceLogs') deviceLogs?: DeviceLog[] = [];

  isLoading: boolean = false;
  tableColumns: ColumnItem<DeviceLog>[] = [
    {
      name: 'ID',
      key: 'id',
      sortFn: (a: DeviceLog, b: DeviceLog) => (a?.id ?? 0) - (b?.id ?? 0),
    },
    {
      name: 'module.device.status',
      key: 'status',
      sortFn: (a: DeviceLog, b: DeviceLog) =>
        (a?.status ?? '').localeCompare(b?.status ?? ''),
    },
    {
      name: 'module.device.update-date',
      key: 'updateDate',
      sortFn: (a: DeviceLog, b: DeviceLog) =>
        new Date(a.date ?? '').getTime() - new Date(b.date ?? '').getTime(),
    },
  ];

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {}
}
