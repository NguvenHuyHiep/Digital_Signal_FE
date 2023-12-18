import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { LhTableComponent } from '@app-common/lib/components/lh-table/lh-table.component';
import { DeviceGroup } from '@app-api/lib/api/models/deviceGroup';
import { DeviceGroupAddComponent } from '@app-admin/app/modules/device-group/components/device-group/device-group-add/device-group-add.component';
import { Device } from '@app-api/lib/api/models/device';
import {
  LhTableConfigModel,
  LhTableFieldType,
} from '@app-common/lib/components/lh-table/lh-table-config.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminDeviceGroupService } from '@app-api/lib/modules/admin/group-device/admin-group-device.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateService } from '@ngx-translate/core';
import { User } from '@app-api/lib/api/models/user';
import { ResponseStatus } from '@app-api/lib/api/models/responseStatus';
import { ColumnItem } from '@app-api/lib/api/models/columnItem';

@Component({
  selector: 'app-admin-device-groups',
  templateUrl: './device-groups.component.html',
  styleUrls: ['./device-groups.component.scss'],
})
export class DeviceGroupsComponent implements OnInit {
  @ViewChild('table') table?: LhTableComponent<DeviceGroup>;
  @ViewChild('addComponent', { static: false })
  addComponent?: DeviceGroupAddComponent;
  devices: Array<Device> = [];

  currentDeviceGroup: DeviceGroup = {};
  deviceGroups: Array<DeviceGroup> = [];
  loading: {
    adding: boolean;
    searching: boolean;
    device: boolean;
  } = {
    adding: false,
    searching: false,
    device: false,
  };

  tableColumns: ColumnItem<DeviceGroup>[] = [
    {
      name: 'module.playlist.name',
      key: 'name',
    },
    {
      name: 'module.playlist.description',
      key: 'description',
    },
  ];

  constructor(
    private modalService: NzModalService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private adminDeviceGroupService: AdminDeviceGroupService,
    private message: NzMessageService,
    private translateService: TranslateService
  ) {}
  ngOnInit(): void {
    this.getAllDeviceGroup();
  }
  get isSelectedRow(): boolean {
    return (this.table?.setOfCheckedId?.size || 0) > 0;
  }

  navigateToUpdate = (record: User): void => {
    console.log(record);
    this.currentDeviceGroup = record;
    this.router.navigate(['./update', record.id], {
      relativeTo: this.activatedRoute,
    });
  };
  navigateToCreate = (): void => {
    this.router.navigate(['./create'], {
      relativeTo: this.activatedRoute,
    });
  };

  deleteSelected() {}

  delete(deviceGroup: DeviceGroup) {
    this.modalService.confirm({
      nzTitle:
        this.translateService.instant(
          'module.groupDevice.modalDeleteGroupDevice'
        ) +
        `${deviceGroup.name}` +
        ' ?',
      nzOnOk: () => {
        new Promise((resolve, reject) => {
          return this.adminDeviceGroupService
            .deleteDeviceGroup(deviceGroup?.id as number)
            .subscribe({
              next: (response) => {
                this.getAllDeviceGroup();
              },
              error: (err) => {
                //TODO Xử lý exception
              },
              complete: () => {
                this.loading.searching = false;
              },
            });
        }).catch((err) => console.log(err));
      },
    });
  }

  private getAllDeviceGroup() {
    this.adminDeviceGroupService.getAllDeviceGroup(0, 1000).subscribe({
      next: (response) => {
        if (response && response.status === ResponseStatus.Success) {
          this.deviceGroups = response.data as DeviceGroup[];
          console.log(this.deviceGroups + 'DeviceGroup');
        } else {
          let errorsInStr: string = response.errors
            ?.map((e) => this.translateService.instant(e))
            .join(',') as string;
          this.message.error(errorsInStr);
          this.deviceGroups = [];
        }
      },
      error: (err) => {
        // TODO i18n
        this.message.error('Error', err);
        this.loading.searching = false;
      },
      complete: () => {
        this.loading.searching = false;
      },
    });
  }
}
