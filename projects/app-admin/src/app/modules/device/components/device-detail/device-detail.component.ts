import { DatePipe, DatePipeConfig, Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { showErrorMessage } from '@app-admin/app/utils/error-msg-utils';
import { Device } from '@app-api/lib/api/models/device';
import { DeviceLog } from '@app-api/lib/api/models/deviceLog';
import { DeviceStatus } from '@app-api/lib/api/models/deviceStatus';
import { ResponseStatus } from '@app-api/lib/api/models/responseStatus';
import { Schedule } from '@app-api/lib/api/models/schedule';
import { AdminDeviceService } from '@app-api/lib/modules/admin/admin-device/admin-device.service';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-admin-device-detail',
  templateUrl: './device-detail.component.html',
  styleUrls: ['./device-detail.component.scss'],
})
export class DeviceDetailComponent implements OnInit {
  deviceId?: number = undefined;
  device?: Device;
  deviceLogs?: DeviceLog[] = [];
  totalDeviceLogs?: DeviceLog[] = [];

  pageLoadingStack: number = 0;

  statusOptions: { label: string; value: DeviceStatus }[] = [
    { label: 'common.all', value: DeviceStatus.Undefined },
    { label: 'common.online', value: DeviceStatus.Online },
    { label: 'common.offline', value: DeviceStatus.Offline },
  ];
  statusSelect: DeviceStatus = DeviceStatus.Undefined;
  searchKeyword: string = '';
  searchForm: FormGroup;

  deviceUpdateForm: FormGroup;

  constructor(
    private adminDeviceService: AdminDeviceService,
    private message: NzMessageService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private datePipe: DatePipe,
    private translate: TranslateService
  ) {
    this.deviceId = this.activatedRoute.snapshot.params['deviceId'];

    this.searchForm = new FormGroup({
      keyword: new FormControl(''),
      status: new FormControl(DeviceStatus.Undefined),
    });

    this.deviceUpdateForm = this.adminDeviceService.buildDeviceForm();
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

    this.getDeviceDetail(this.deviceId);

    this.getAllDeviceLogs(this.deviceId as number, this.statusSelect);
  }

  getDeviceDetail(deviceId?: number): void {
    if (!deviceId) {
      this.message.error(
        this.translate.instant('module.device.error.id-invalid')
      );
      return;
    }

    this.showLoading(true);
    this.adminDeviceService.getDeviceById(deviceId).subscribe({
      next: (response) => {
        if (response && response.status === ResponseStatus.Success) {
          this.device = response.data as Device;
          this.deviceUpdateForm.patchValue(this.device);
        } else if (response && response.status === ResponseStatus.Failed) {
          showErrorMessage(
            this.message,
            this.translate,
            response.errors as string[]
          );
        } else {
          this.message.error(
            this.translate.instant('module.device.error.get-detail')
          );
        }
      },
      error: (err) => {
        console.error(err);
        if (err instanceof HttpErrorResponse) {
          showErrorMessage(this.message, this.translate, err.error.errors);
        } else {
          this.message.error(
            this.translate.instant('module.device.error.get-detail')
          );
        }
        this.showLoading(false);
      },
      complete: () => {
        this.showLoading(false);
      },
    });
  }

  getAllDeviceLogs(currentDeviceId: number, status?: DeviceStatus | undefined) {
    if (currentDeviceId && !isNaN(currentDeviceId)) {
      this.showLoading(true);
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
            this.showLoading(false);
          },
          complete: () => {
            this.showLoading(false);
          },
        });
    }
  }

  update() {
    if (!this.deviceId || !this.deviceUpdateForm.value) {
      this.message.error(
        this.translate.instant('module.device.error.id-or-device-invalid')
      );
      return;
    }

    this.showLoading(true);
    this.adminDeviceService
      .updateDevice(this.deviceId, this.deviceUpdateForm.value)
      .subscribe({
        next: (response) => {
          if (response && response.status === ResponseStatus.Success) {
            this.device = response.data as Device;
            this.deviceUpdateForm.patchValue(this.device);
          } else if (response && response.status === ResponseStatus.Failed) {
            showErrorMessage(
              this.message,
              this.translate,
              response.errors as string[]
            );
          } else {
            this.message.error(
              this.translate.instant('module.device.error.update_failed')
            );
          }
        },
        error: (err: any) => {
          console.error(err);
          if (err instanceof HttpErrorResponse) {
            showErrorMessage(this.message, this.translate, err.error.errors);
          } else {
            this.message.error(
              this.translate.instant('module.device.error.update_failed')
            );
          }
          this.showLoading(false);
        },
        complete: () => {
          this.showLoading(false);
        },
      });
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

  showLoading(isLoading: boolean) {
    if (isLoading) {
      this.pageLoadingStack++;
    } else {
      this.pageLoadingStack === 0 ? 0 : this.pageLoadingStack--;
    }
  }
}
