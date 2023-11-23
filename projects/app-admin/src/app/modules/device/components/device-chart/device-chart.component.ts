import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AdminDeviceService } from '../../../../../../../app-api/src/lib/modules/admin/admin-device/admin-device.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Chart } from '@antv/g2';
import { DeviceLog } from 'projects/app-api/src/lib/api/models/deviceLog';
import { Device } from 'scripts/projects/app-api/src/lib/api/models/device';

@Component({
  selector: 'app-admin-device-chart',
  templateUrl: './device-chart.component.html',
  styleUrls: ['./device-chart.component.scss'],
})
export class DeviceChartComponent<T extends Object> {
  @Input('device') device: Device = {};
  @Output() deviceChart: EventEmitter<T> = new EventEmitter<T>();

  deviceLogs: DeviceLog[] = [];
  constructor(
    private adminDeviceService: AdminDeviceService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.getAllDeviceLogs(this.device.id as number);
  }

  ngAfterViewInit() {}

  getAllDeviceLogs(currentDeviceId: number) {
    if (currentDeviceId) {
      this.adminDeviceService.getDeviceByIdWithLogs(currentDeviceId).subscribe({
        next: (response) => {
          if (response && response.data && response.data.deviceLogs) {
            console.log(this.getMinutesInDay());

            this.deviceLogs = response.data.deviceLogs;
            setTimeout(() => {
              this.drawChart(this.deviceLogs);
            }, 0);
          }
        },
        error: (err) => {
          this.message.error('Error', err);
        },
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
        value: currentLog?.status || Device.StatusEnum.Offline,
      };
      return obj;
    });

    let chartName = this.device.id;
    if (!chartName) {
      chartName = -1;
    }
    const chart = new Chart({
      container: chartName.toString(),
      autoFit: true,
    });

    chart.data(data);
    chart.scale({
      value: {
        ticks: [Device.StatusEnum.Offline, Device.StatusEnum.Online],
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

    chart.forceFit();
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
}
