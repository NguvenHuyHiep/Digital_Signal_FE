import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnItem } from '@app-api/lib/api/models/columnItem';
import { Device } from '@app-api/lib/api/models/device';
import { DeviceGroup } from '@app-api/lib/api/models/deviceGroup';
import { DeviceStatus } from '@app-api/lib/api/models/deviceStatus';
import { ResponseStatus } from '@app-api/lib/api/models/responseStatus';
import { AdminDeviceService } from '@app-api/lib/modules/admin/admin-device/admin-device.service';
import { AdminDeviceGroupService } from '@app-api/lib/modules/admin/group-device/admin-group-device.service';
import {
  LhTableConfigModel,
  LhTableFieldType,
} from '@app-common/lib/components/lh-table/lh-table-config.model';
import { LhTableComponent } from '@app-common/lib/components/lh-table/lh-table.component';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-admin-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss'],
  providers: [AdminDeviceGroupService],
})
export class DeviceListComponent<T extends Object> implements OnInit {
  @ViewChild('table') table?: LhTableComponent<Device>;
  @Input() deviceGroupAdmin?: DeviceGroup;
  @Output() onGroup: EventEmitter<T> = new EventEmitter<T>();

  statusOptions: { label: string; value: string }[] = [
    { label: 'common.all', value: DeviceStatus.Undefined },
    { label: 'common.online', value: DeviceStatus.Online },
    { label: 'common.offline', value: DeviceStatus.Offline },
  ];
  statusSelect: DeviceStatus = DeviceStatus.Undefined;

  loading: {
    detail: boolean;
    adding: boolean;
    searching: boolean;
  } = {
    detail: false,
    adding: false,
    searching: false,
  };

  tableColumns: ColumnItem<Device>[] = [
    {
      name: 'ID',
      key: 'id',
    },
    {
      name: 'module.device.code',
      key: 'code',
    },
    {
      name: 'module.device.name',
      key: 'name',
    },
    {
      name: 'module.device.info',
      key: 'information',
    },
    {
      name: 'module.device.status',
      key: 'status',
    },
  ];

  devices: Device[] = [];
  currentDevice: Device = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private adminDeviceService: AdminDeviceService,
    private adminDeviceGroupService: AdminDeviceGroupService,
    private translateService: TranslateService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loading.searching = true;
    if (this.deviceGroupAdmin) {
      this.adminDeviceGroupService
        .getDeviceGroupByDeviceGroupId(this.deviceGroupAdmin.id as number)
        .subscribe({
          next: (response) => {
            if (response && response.status === ResponseStatus.Success) {
              this.devices = response.data?.devices as Array<Device>;
            } else {
              let errorsInStr: string = response.errors
                ?.map((e) => this.translateService.instant(e))
                .join(', ') as string;
              this.message.error(errorsInStr);
            }
          },
          error: (err) => {
            //TODO Xử lý exception
          },
          complete: () => {
            this.loading.searching = false;
          },
        });
    } else {
      this.adminDeviceService
        .getAllDevice(0, 100, 'id', 'DESC', '', this.statusSelect)
        .subscribe({
          next: (response) => {
            if (response && response.data) {
              this.devices = response.data;
            }
          },
          error: (err) => {
            //TODO Xử lý exception
          },
          complete: () => {
            this.loading.searching = false;
          },
        });
    }
  }

  navigateToDetail = (record: Device): void => {
    console.log(record);
    this.router.navigate(['./detail', record.id], {
      relativeTo: this.activatedRoute,
    });
  };

  onStatusChange(selectedValue: string): void {
    if (this.statusSelect === selectedValue) {
      this.ngOnInit();
    }
  }
}
