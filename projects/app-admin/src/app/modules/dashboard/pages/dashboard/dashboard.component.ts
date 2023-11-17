import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { BreadcrumbOption } from 'ng-zorro-antd/breadcrumb/breadcrumb.component';
import { LhAuthenService } from '../../../../../../../app-api/src/lib/modules/authen/lh-authen.service';
import { User } from '../../../../../../../app-api/src/lib/api/models/user';
import { SignedDeviceControllerService } from '../../../../../../../app-api/src/lib/api/controller/signedDeviceController.service';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

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

  statisics: { type: string; label: string; value: number }[] = [
    { type: 'stock', label: 'module.dashboard.deviceTotal', value: 100 },
    { type: 'check', label: 'module.dashboard.deviceOnline', value: 70 },
    { type: 'stop', label: 'module.dashboard.deviceOffline', value: 30 },
    { type: 'cluster', label: 'module.dashboard.deviceGroup', value: 10 },
  ];

  constructor(
    private authenService: LhAuthenService,
    private signedDeviceControllerService: SignedDeviceControllerService
  ) {
    this.authenService.userObs.subscribe((user) => (this.user = user));
  }

  ngOnInit() {
    this.signedDeviceControllerService.getByPaging(1, 20).subscribe({
      next: (value) => alert(JSON.stringify(value)),
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.loading = false;

      setTimeout(() => {
        // this.getStores();
        // this.eventResize();
      }, 0);
    }, 600);
  }
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  // Pie
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [['Offline'], ['Online']],
    datasets: [
      {
        data: [30, 70],
      },
    ],
  };
  public pieChartType: ChartType = 'pie';
  public pieChartPlugins = [];
}
