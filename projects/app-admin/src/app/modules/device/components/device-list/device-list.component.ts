import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Device } from '@app-api/lib/api/models/device';
import { DeviceLog } from '@app-api/lib/api/models/deviceLog';
import { DeviceStatus } from '@app-api/lib/api/models/deviceStatus';
import { AdminDeviceGroupService } from '@app-api/lib/modules/admin/group-device/admin-group-device.service';

@Component({
  selector: 'app-admin-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss'],
  providers: [AdminDeviceGroupService],
})
export class DeviceListComponent implements OnInit {
  statusOptions: { label: string; value: string }[] = [
    { label: 'common.all', value: DeviceStatus.Undefined },
    { label: 'common.online', value: DeviceStatus.Online },
    { label: 'common.offline', value: DeviceStatus.Offline },
  ];
  statusSelect: DeviceStatus = DeviceStatus.Undefined;

  device: Device = {};
  deviceLogs: DeviceLog[] = [];

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {}

  navigateToDetail(record: Device): void {
    console.log(record);
    this.router.navigate(['./detail', record.id], {
      relativeTo: this.activatedRoute,
    });
  }
}
