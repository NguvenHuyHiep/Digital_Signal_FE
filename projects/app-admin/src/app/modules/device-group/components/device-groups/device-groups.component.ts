import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { LhTableComponent } from '@app-common/lib/components/lh-table/lh-table.component';
import { DeviceGroup } from '@app-api/lib/api/models/deviceGroup';
import { DeviceGroupAddComponent } from '@app-admin/app/modules/device-group/components/device-group/device-group-add/device-group-add.component';
import { Device } from '@app-api/lib/api/models/device';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminDeviceGroupService } from '@app-api/lib/modules/admin/group-device/admin-group-device.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateService } from '@ngx-translate/core';
import { User } from '@app-api/lib/api/models/user';
import { ResponseStatus } from '@app-api/lib/api/models/responseStatus';
import { ColumnItem } from '@app-api/lib/api/models/columnItem';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-admin-device-groups',
  templateUrl: './device-groups.component.html',
  styleUrls: ['./device-groups.component.scss'],
})
export class DeviceGroupsComponent implements OnInit {
  @ViewChild('table') table?: LhTableComponent<DeviceGroup>;
  @ViewChild('addComponent', { static: false })
  addComponent?: DeviceGroupAddComponent;
  devices: Device[] = [];
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

  tableDeviceColumns: ColumnItem<Device>[] = [
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

  total: number = 0;
  pageIndex: number = 1;
  pageSize: number = 10;

  constructor(
    private modalService: NzModalService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private adminDeviceGroupService: AdminDeviceGroupService,
    private message: NzMessageService,
    private translateService: TranslateService
  ) {}
  ngOnInit(): void {}

  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.getDeviceListsByDeviceGroupId(id);
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
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
                this.getDeviceGroupByPaging();
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

  getDeviceGroupByPaging(
    pageIndex?: number,
    pageSize?: number,
    sortBy?: string,
    sortDirection?: string,
    keyword?: string
  ) {
    this.loading.searching = true;
    this.adminDeviceGroupService
      .getDeviceGroupByPaging(
        pageIndex || 0,
        pageSize || 10,
        sortBy || 'id',
        sortDirection || 'desc',
        keyword || ''
      )
      .subscribe({
        next: (response) => {
          if (response && response.status === ResponseStatus.Success) {
            this.deviceGroups = response.data as DeviceGroup[];
            console.log(this.deviceGroups + 'DeviceGroup');
            this.total = response.total as number;
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

  getDeviceListsByDeviceGroupId(deviceGroupId: number): void {
    this.loading.searching = true;
    if (deviceGroupId) {
      this.adminDeviceGroupService
        .getDeviceGroupWithDevicesById(deviceGroupId)
        .subscribe({
          next: (response) => {
            if (response && response.status === ResponseStatus.Success) {
              this.devices = (response.data?.devices as Array<Device>) || [];
              console.log('Device list: ', this.devices);
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

  onQueryParamsChange(params: NzTableQueryParams) {
    console.log('params:', params);
    const { pageIndex, pageSize, sort, filter } = params;
    const { key, value } = sort?.find((s) => s.value) || {};
    this.getDeviceGroupByPaging(
      pageIndex - 1,
      pageSize,
      key,
      value?.replace(/end$/, '')
    );
  }
}
