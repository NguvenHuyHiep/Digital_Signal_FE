import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceLog } from '@app-api/lib/api/models/deviceLog';
import { Schedule } from '@app-api/lib/api/models/schedule';
import { AdminDeviceService } from '@app-api/lib/modules/admin/admin-device/admin-device.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-admin-device-detail',
  templateUrl: './device-detail.component.html',
  styleUrls: ['./device-detail.component.scss'],
})
export class DeviceDetailComponent {
  deviceId?: number = undefined;
  deviceLogs?: DeviceLog[] = [];

  constructor(
    private adminDeviceService: AdminDeviceService,
    private message: NzMessageService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    this.deviceId = this.activatedRoute.snapshot.params['deviceId'];
    this.getAllDeviceLogs(this.deviceId as number);
  }

  getAllDeviceLogs(currentDeviceId: number) {
    if (currentDeviceId && !isNaN(currentDeviceId)) {
      this.adminDeviceService.getDeviceByIdWithLogs(currentDeviceId).subscribe({
        next: (response) => {
          if (response && response.data && response.data.deviceLogs) {
            this.deviceLogs = response.data.deviceLogs;
          }
        },
        error: (err) => {
          this.message.error('Error', err);
        },
        complete: () => {},
      });
    }
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
}
