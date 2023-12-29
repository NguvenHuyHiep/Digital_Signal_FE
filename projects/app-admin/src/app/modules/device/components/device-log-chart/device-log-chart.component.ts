import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chart } from '@antv/g2';
import { DeviceLog } from '@app-api/lib/api/models/deviceLog';
import { DeviceStatus } from '@app-api/lib/api/models/deviceStatus';

@Component({
  selector: 'app-admin-device-log-chart',
  templateUrl: './device-log-chart.component.html',
  styleUrls: ['./device-log-chart.component.scss'],
})
export class DeviceLogChartComponent implements OnChanges {
  @Input('deviceId') deviceId?: number = NaN;
  @Input('deviceLogs') deviceLogs?: DeviceLog[] = [];

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['deviceLogs'] && changes['deviceLogs'].currentValue) {
      setTimeout(() => this.drawChart(this.deviceLogs as Array<DeviceLog>), 0);
    }
  }

  drawChart(logs: DeviceLog[]) {
    if (!logs || logs.length === 0) {
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
      container: this.deviceId?.toString() ?? new HTMLElement(),
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
