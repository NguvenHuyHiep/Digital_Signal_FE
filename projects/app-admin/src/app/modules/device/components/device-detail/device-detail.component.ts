import { DatePipe, Location } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Chart } from '@antv/g2';
import { DeviceLog } from 'projects/app-api/src/lib/api/models/deviceLog';
import { AdminDeviceService } from 'projects/app-api/src/lib/modules/admin/admin-device/admin-device.service';
import {
  LhTableConfigModel,
  LhTableFieldType,
} from 'projects/app-common/src/lib/components/lh-table/lh-table-config.model';
import { LhTableComponent } from 'projects/app-common/src/lib/components/lh-table/lh-table.component';
import { DeviceStatus } from '../../../../../../../app-api/src/lib/api/models/deviceStatus';
import { Schedule } from '../../../../../../../app-api/src/lib/api/models/schedule';
import { ActivatedRoute, Router } from '@angular/router';

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

  tableConfig: LhTableConfigModel = {
    key: 'id',
    disableDetail: true,
    fields: [
      {
        label: 'status',
        field: 'status',
        type: LhTableFieldType.STRING,
      },
      {
        label: 'date',
        field: 'date',
        type: LhTableFieldType.DATE_TIME,
      },
    ],
  };

  deviceLogs: DeviceLog[] = [];

  constructor(
    private adminDeviceService: AdminDeviceService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location
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

    console.log('Data log: ', data);

    // const data1 = [
    //   { time: '21:08', type: 'ONLINE', value: 1 },
    //   { time: '21:08', type: 'ONLINE', value: 1 },
    //   { time: '21:38', type: 'ONLINE', value: 1 },
    //   { time: '21:38', type: 'ONLINE', value: 1 },
    //   { time: '22:08', type: 'ONLINE', value: 1 },
    //   { time: '22:08', type: 'ONLINE', value: 1 },
    //   { time: '22:38', type: 'ONLINE', value: 1 },
    //   { time: '22:38', type: 'ONLINE', value: 1 },
    //   { time: '23:08', type: 'ONLINE', value: 1 },
    //   { time: '23:08', type: 'ONLINE', value: 1 },
    //   { time: '23:38', type: 'ONLINE', value: 1 },
    //   { time: '23:38', type: 'ONLINE', value: 1 },
    //   { time: '00:08', type: 'ONLINE', value: 1 },
    //   { time: '00:08', type: 'ONLINE', value: 1 },
    //   { time: '00:38', type: 'ONLINE', value: 1 },
    //   { time: '00:38', type: 'ONLINE', value: 1 },
    //   { time: '01:08', type: 'ONLINE', value: 1 },
    //   { time: '01:08', type: 'ONLINE', value: 1 },
    //   { time: '01:38', type: 'ONLINE', value: 1 },
    //   { time: '01:38', type: 'ONLINE', value: 1 },
    //   { time: '02:08', type: 'ONLINE', value: 1 },
    //   { time: '02:08', type: 'ONLINE', value: 1 },
    //   { time: '02:38', type: 'ONLINE', value: 1 },
    //   { time: '02:38', type: 'ONLINE', value: 1 },
    //   { time: '02:08', type: 'ONLINE', value: 1 },
    //   { time: '02:08', type: 'ONLINE', value: 1 },
    //   { time: '02:38', type: 'ONLINE', value: 1 },
    //   { time: '02:38', type: 'ONLINE', value: 1 },
    // ];

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
