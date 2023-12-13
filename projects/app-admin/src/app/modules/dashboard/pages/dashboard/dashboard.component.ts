import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DashBoardStatictist } from '@app-api/lib/api/models/dashBoardStatictist';
import { ResponseStatus } from '@app-api/lib/api/models/responseStatus';
import { AdminDashBoardService } from '@app-api/lib/modules/admin/admin-dashboard/admin-dashboard.service';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BreadcrumbOption } from 'ng-zorro-antd/breadcrumb';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  bread: BreadcrumbOption[] = [];
  loading = true;
  chatTimeout: number | null = null;

  dashBoardStatictist: DashBoardStatictist = {};
  statisics: { icon: string; type: string; label: string; value: number }[] = [
    {
      icon: 'stock',
      type: 'devices',
      label: 'module.dashboard.deviceTotal',
      value: 0,
    },
    {
      icon: 'check',
      type: 'online-devices',
      label: 'module.dashboard.deviceOnline',
      value: 0,
    },
    {
      icon: 'stop',
      type: 'offline-devices',
      label: 'module.dashboard.deviceOffline',
      value: 0,
    },
    {
      icon: 'cluster',
      type: 'device-groups',
      label: 'module.dashboard.deviceGroup',
      value: 0,
    },
  ];

  // Pie
  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };
  pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [['Offline'], ['Online']],
    datasets: [
      {
        data: [30, 70],
      },
    ],
  };
  pieChartType: ChartType = 'pie';

  constructor(private adminDashBoardService: AdminDashBoardService) {}

  ngOnInit() {
    this.loading = true;
    this.adminDashBoardService.getDashBoardStatictist().subscribe({
      next: (response) => {
        this.loading = false;
        console.log(response);
        if (response && response.status === ResponseStatus.Success) {
          this.dashBoardStatictist = response.data;
          this.statisics.map((s) => {
            if (s.type === 'devices') {
              s.value =
                (this.dashBoardStatictist.totalOfflineDevices || 0) +
                (this.dashBoardStatictist.totalOnlineDevices || 0);
            } else if (s.type === 'online-devices') {
              s.value = this.dashBoardStatictist.totalOnlineDevices || 0;
            } else if (s.type === 'offline-devices') {
              s.value = this.dashBoardStatictist.totalOfflineDevices || 0;
            } else if (s.type === 'device-groups') {
              s.value = this.dashBoardStatictist.totalDeviceGroups || 0;
            }
          });
          let totalDevices =
            (this.dashBoardStatictist.totalOfflineDevices || 0) +
            (this.dashBoardStatictist.totalOnlineDevices || 0);

          if (totalDevices === 0) {
            this.pieChartData.datasets[0].data = [0, 0];
          } else {
            this.pieChartData.datasets[0].data = [
              (this.dashBoardStatictist.totalOfflineDevices || 0) /
                totalDevices,
              (this.dashBoardStatictist.totalOnlineDevices || 0) / totalDevices,
            ];
          }
        }
      },
      error: (err) => {
        this.loading = false;
        console.log(err);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
