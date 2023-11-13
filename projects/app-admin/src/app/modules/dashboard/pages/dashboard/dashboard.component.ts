import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BreadcrumbOption } from 'ng-zorro-antd/breadcrumb/breadcrumb.component';
import { Chart } from '@antv/g2';
import {LhAuthenService} from "../../../../../../../app-api/src/lib/modules/authen/lh-authen.service";
import {User} from "../../../../../../../app-api/src/lib/api/models/user";
import {
  SignedDeviceControllerService
} from "../../../../../../../app-api/src/lib/api/controller/signedDeviceController.service";

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  bread: BreadcrumbOption[] = [];
  user?: User;
  loading = true;
  chatTimeout: number | null = null;

  statisics: {type: string; label: string; value: number}[] = [
    { type: 'stop', label: 'module.dashboard.stop', value: 1 },
    { type: 'pause-circle', label: 'module.dashboard.unfinished', value: 10 },
    { type: 'close-circle', label: 'module.dashboard.cancel', value: 10 },
    { type: 'check-circle', label: 'module.dashboard.finished', value: 10 },
  ]

  statisics1: { type: string; label: string; value: number }[] = [
    { type: 'audit', label: 'module.dashboard.learning', value: 20 },
    { type: 'crown', label: 'module.dashboard.goals', value: 5 },
    { type: 'schedule', label: 'module.dashboard.curriculum', value: 2 },
    { type: 'menu', label: 'module.dashboard.courses', value: 10 },
    { type: 'team', label: 'module.dashboard.class', value: 6 },
    { type: 'book', label: 'module.dashboard.practice', value: 4 },
  ];

  constructor(private authenService:LhAuthenService
  , private signedDeviceControllerService: SignedDeviceControllerService
  ) {
    this.authenService.userObs.subscribe(user => this.user = user);
  }

  ngOnInit() {
    console.log('Test call API');
    this.signedDeviceControllerService.getByPaging(1,20).subscribe({
      next: value => alert(JSON.stringify(value))
    })

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.loading = false;

      setTimeout(() => {
        this.getStores();

        // this.eventResize();
      }, 0);
    }, 600);
  }

  private getStores(): void {
    const data = [
      { time: '21:08', type: 'Classes by planned', value: 71 },
      { time: '21:08', type: 'Classes by registration', value: 30 },
      { time: '21:38', type: 'Classes by planned', value: 21 },
      { time: '21:38', type: 'Classes by registration', value: 63 },
      { time: '22:08', type: 'Classes by planned', value: 107 },
      { time: '22:08', type: 'Classes by registration', value: 28 },
      { time: '22:38', type: 'Classes by planned', value: 47 },
      { time: '22:38', type: 'Classes by registration', value: 97 },
      { time: '23:08', type: 'Classes by planned', value: 22 },
      { time: '23:08', type: 'Classes by registration', value: 109 },
      { time: '23:38', type: 'Classes by planned', value: 17 },
      { time: '23:38', type: 'Classes by registration', value: 36 },
      { time: '00:08', type: 'Classes by planned', value: 83 },
      { time: '00:08', type: 'Classes by registration', value: 109 },
      { time: '00:38', type: 'Classes by planned', value: 95 },
      { time: '00:38', type: 'Classes by registration', value: 98 },
      { time: '01:08', type: 'Classes by planned', value: 21 },
      { time: '01:08', type: 'Classes by registration', value: 75 },
      { time: '01:38', type: 'Classes by planned', value: 71 },
      { time: '01:38', type: 'Classes by registration', value: 108 },
      { time: '02:08', type: 'Classes by planned', value: 76 },
      { time: '02:08', type: 'Classes by registration', value: 72 },
      { time: '02:38', type: 'Classes by planned', value: 60 },
      { time: '02:38', type: 'Classes by registration', value: 84 },
      { time: '02:08', type: 'Classes by planned', value: 76 },
      { time: '02:08', type: 'Classes by registration', value: 72 },
      { time: '02:38', type: 'Classes by planned', value: 60 },
      { time: '02:38', type: 'Classes by registration', value: 84 },
    ];

    const chart = new Chart({
      container: 'stores',
      autoFit: true,
      height: 500,
    });

    chart.data(data);
    chart.scale({
      value: {
        ticks: [0, 20, 40, 60, 80, 100, 120],
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

    chart.line().position('time*value').color('type');

    chart.render();
  }
}
