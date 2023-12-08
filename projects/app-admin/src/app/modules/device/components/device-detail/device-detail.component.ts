import {
  LhTableConfigModel,
  LhTableFieldType,
} from '@app-common/lib/components/lh-table/lh-table-config.model';
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
  NzTableSortFn,
  NzTableSortOrder,
} from 'ng-zorro-antd/table';
import { TranslateService } from '@ngx-translate/core';

interface ColumnItem {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<DeviceLog> | null;
  listOfFilter: NzTableFilterList;
  filterFn: NzTableFilterFn<DeviceLog> | null;
  filterMultiple: boolean;
  sortDirections: NzTableSortOrder[];
}

@Component({
  selector: 'app-admin-device-detail',
  templateUrl: './device-detail.component.html',
  styleUrls: ['./device-detail.component.scss'],
})
export class DeviceDetailComponent implements OnInit, AfterViewInit {
  @Input('deviceId') deviceId?: number;
  @Input('currentDevice') currentDevice?: DeviceStatus;
  @ViewChild('table') table?: LhTableComponent<DeviceLog>;

  showFrame: {
    search: boolean;
  } = {
    search: true,
  };

  loading: {
    searching: boolean;
  } = {
    searching: false,
  };

  tableColumns: ColumnItem[] = [
    {
      name: 'ID',
      sortOrder: 'descend',
      sortFn: (a: DeviceLog, b: DeviceLog) =>
        (a.id as number) - (b.id as number),
      listOfFilter: [],
      filterFn: null,
      filterMultiple: false,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: this.translateService.instant('module.device.status'),
      sortOrder: null,
      sortFn: (a: DeviceLog, b: DeviceLog) => (a.status === b.status ? 1 : 0),
      listOfFilter: [
        { text: 'ONLINE', value: 'ONLINE' },
        { text: 'OFFLINE', value: 'OFFLINE' },
      ],
      filterFn: (address: string, item: DeviceLog) =>
        item?.status?.indexOf(address) !== -1,
      filterMultiple: false,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: this.translateService.instant('module.device.update-date'),
      sortOrder: null,
      sortFn: (a: DeviceLog, b: DeviceLog) =>
        Date.parse(a.date as string) - Date.parse(b.date as string),
      listOfFilter: [],
      filterFn: null,
      filterMultiple: false,
      sortDirections: ['ascend', 'descend', null],
    },
  ];

  deviceLogs: DeviceLog[] = [];

  constructor(
    private adminDeviceService: AdminDeviceService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private translateService: TranslateService
  ) {
    this.deviceId = this.activatedRoute.snapshot.params['deviceId'];
  }

  ngOnInit() {
    console.log(this.deviceId);
    this.getAllDeviceLogs(this.deviceId as number);
  }

  ngAfterViewInit(): void {}

  getAllDeviceLogs(currentDeviceId: number) {
    if (currentDeviceId) {
      this.adminDeviceService.getDeviceByIdWithLogs(currentDeviceId).subscribe({
        next: (response) => {
          if (response && response.data && response.data.deviceLogs) {
            console.log(this.getMinutesInDay());

            this.deviceLogs = response.data.deviceLogs;
            setTimeout(() => {
              this.drawChart(this.deviceLogs);

              // this.eventResize();
            }, 0);
          }
        },
        error: (err) => {},
        complete: () => {},
      });
    }
  }

  drawChart(logs: DeviceLog[]) {
    if (!logs) {
      return;
    }

    const data = this.getMinutesInDay().map((minute) => {
      let currentLog = logs.find(
        (l) => this.getHourAndMiniteFromDate(l?.date) === minute
      );

      let obj: {
        time?: string;
        type?: string;
        value?: string;
      } = {
        time: minute,
        type: 'Status',
        value: currentLog?.status || DeviceStatus.Offline,
      };
      return obj;
    });

    const chart = new Chart({
      container: 'device-log-chart1',
      autoFit: true,
      height: 300,
    });

    chart.data(data);
    chart.scale({
      value: {
        ticks: [DeviceStatus.Offline, DeviceStatus.Online],
      },
      time: {
        range: [0, 1],
        tickInterval: 2,
        tickCount: 9,
      },
    });

    chart.tooltip({
      showCrosshairs: true,
      shared: true,
    });

    chart.axis('value', {
      label: {
        formatter: (val) => {
          return val + '';
        },
      },
    });

    chart.legend('type', {
      position: 'top',
    });

    chart.option('slider', {});

    chart.line().position('time*value').color('red');

    chart.render();
  }

  getMinutesInDay(): string[] {
    const minutes: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute++) {
        let hourStr = hour.toString();
        let minuteStr = minute.toString();

        if (hour < 10) hourStr = `0${hour}`;
        if (minute < 10) minuteStr = `0${minute}`;

        const time = `${hourStr}:${minuteStr}`;

        minutes.push(time);
      }
    }
    return minutes;
  }

  getHourAndMiniteFromDate(dateInStr?: string) {
    if (!dateInStr) return '';
    let date = new Date(dateInStr);
    // Get hour and minute values
    const hour = date.getHours();
    const minute = date.getMinutes();

    // Pad values if single digit
    let hourStr = hour.toString();
    let minStr = minute.toString();

    if (hour < 10) {
      hourStr = '0' + hour;
    }

    if (minute < 10) {
      minStr = '0' + minute;
    }

    // Format as HH:mm string
    const time = hourStr + ':' + minStr;
    return time;
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
}
