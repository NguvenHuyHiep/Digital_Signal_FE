import { DatePipe, DatePipeConfig, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceLog } from '@app-api/lib/api/models/deviceLog';
import { DeviceStatus } from '@app-api/lib/api/models/deviceStatus';
import { Schedule } from '@app-api/lib/api/models/schedule';
import { AdminDeviceService } from '@app-api/lib/modules/admin/admin-device/admin-device.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-admin-device-detail',
  templateUrl: './device-detail.component.html',
  styleUrls: ['./device-detail.component.scss'],
})
export class DeviceDetailComponent implements OnInit {
  deviceId?: number = undefined;
  deviceLogs?: DeviceLog[] = [];
  totalDeviceLogs?: DeviceLog[] = [];

  statusOptions: { label: string; value: DeviceStatus }[] = [
    { label: 'common.all', value: DeviceStatus.Undefined },
    { label: 'common.online', value: DeviceStatus.Online },
    { label: 'common.offline', value: DeviceStatus.Offline },
  ];
  statusSelect: DeviceStatus = DeviceStatus.Undefined;
  searchKeyword: string = '';
  searchForm: FormGroup;

  constructor(
    private adminDeviceService: AdminDeviceService,
    private message: NzMessageService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private datePipe: DatePipe
  ) {
    this.searchForm = new FormGroup({
      keyword: new FormControl(''),
      status: new FormControl(DeviceStatus.Undefined),
    });

    this.deviceId = this.activatedRoute.snapshot.params['deviceId'];
    this.getAllDeviceLogs(this.deviceId as number, this.statusSelect);
  }

  ngOnInit(): void {
    this.searchForm.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((data) => {
        if (data) {
          this.deviceLogs = this.totalDeviceLogs
            ?.filter((l) => {
              return (
                !data.keyword ||
                this.datePipe
                  .transform(l.date, 'dd/M/yyyy - h:mm:ss')
                  ?.includes(data.keyword)
              );
            })
            ?.filter((l) => {
              return (
                data.status === DeviceStatus.Undefined ||
                l.status === data.status
              );
            });
        }
      });
  }

  getAllDeviceLogs(currentDeviceId: number, status?: DeviceStatus | undefined) {
    if (currentDeviceId && !isNaN(currentDeviceId)) {
      this.adminDeviceService
        .getDeviceByIdWithLogs(currentDeviceId, status)
        .subscribe({
          next: (response) => {
            if (response && response.data && response.data.deviceLogs) {
              this.deviceLogs = this.totalDeviceLogs = response.data.deviceLogs;
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

  onClearKeyword() {
    this.searchForm.setValue({
      keyword: '',
      status: this.searchForm.value.status,
    });
  }
}
