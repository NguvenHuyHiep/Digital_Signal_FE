import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Device } from 'projects/app-api/src/lib/api/models/device';
import { AdminDeviceService } from 'projects/app-api/src/lib/modules/admin/admin-device/admin-device.service';
import {
  LhTableConfigModel,
  LhTableFieldType,
} from 'projects/app-common/src/lib/components/lh-table/lh-table-config.model';
import { LhTableComponent } from 'projects/app-common/src/lib/components/lh-table/lh-table.component';
import { DeviceGroup } from 'projects/app-api/src/lib/api/models/deviceGroup';
import { AdminDeviceGroupService } from 'projects/app-api/src/lib/modules/admin/group-device/admin-group-device.service';
import { Schedule } from '../../../../../../../app-api/src/lib/api/models/schedule';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseStatus } from '../../../../../../../app-api/src/lib/api/models/responseStatus';
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

  loading: {
    detail: boolean;
    adding: boolean;
    searching: boolean;
  } = {
    detail: false,
    adding: false,
    searching: false,
  };

  tableConfig: LhTableConfigModel = {
    key: 'id',
    disableUpdate: true,
    disableDelete: true,
    fields: [
      {
        label: 'ID',
        field: 'id',
        type: LhTableFieldType.STRING,
      },
      {
        label: 'module.device.code',
        field: 'code',
        type: LhTableFieldType.STRING,
      },
      {
        label: 'module.device.name',
        field: 'name',
        type: LhTableFieldType.STRING,
      },
      {
        label: 'module.device.info',
        field: 'information',
        type: LhTableFieldType.STRING,
      },
      {
        label: 'module.device.status',
        field: 'status',
        type: LhTableFieldType.STRING,
      },
    ],
  };

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
      this.adminDeviceService.getAllDevice().subscribe({
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

  navigateToDetail = (record: Schedule): void => {
    console.log(record);
    this.router.navigate(['./detail', record.id], {
      relativeTo: this.activatedRoute,
    });
  };
}
