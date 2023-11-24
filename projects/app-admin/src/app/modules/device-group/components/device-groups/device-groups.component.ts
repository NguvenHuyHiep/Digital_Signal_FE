import { Component, OnInit, ViewChild } from '@angular/core';
import { DeviceGroup } from '../../../../../../../app-api/src/lib/api/models/deviceGroup';
import { LhTableComponent } from '../../../../../../../app-common/src/lib/components/lh-table/lh-table.component';
import { DeviceGroupAddComponent } from '../device-group/device-group-add/device-group-add.component';
import {
  LhTableConfigModel,
  LhTableFieldType,
} from '../../../../../../../app-common/src/lib/components/lh-table/lh-table-config.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { translate } from '@antv/g2/lib/util/transform';
import { AdminDeviceGroupService } from '../../../../../../../app-api/src/lib/modules/admin/group-device/admin-group-device.service';
import { Device } from '../../../../../../../app-api/src/lib/api/models/device';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../../../../../../app-api/src/lib/api/models/user';
import { ResponseStatus } from '../../../../../../../app-api/src/lib/api/models/responseStatus';
import { NzModalService } from 'ng-zorro-antd/modal';

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
  query: {
    action?: string;
    id?: string;
  } = {
    action: undefined,
    id: undefined,
  };
  tableConfig: LhTableConfigModel = {
    disableDetail: true,
    key: 'id',
    fields: [
      {
        label: 'module.groupDevice.name',
        field: 'name',
        type: LhTableFieldType.STRING,
      },
      {
        label: 'module.groupDevice.description',
        field: 'description',
        type: LhTableFieldType.STRING,
      },
    ],
  };
  tableDeviceConfig: LhTableConfigModel = {
    key: 'id',
    disableDetail: true,
    disableUpdate: false,
    disableDelete: true,
    fields: [
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

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private adminDeviceGroupService: AdminDeviceGroupService,
    private message: NzMessageService,
    private translateService: TranslateService,
    private modalService: NzModalService
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
      nzTitle: `Do you want to delete the device group: ${deviceGroup.name} ?`,
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
    this.adminDeviceGroupService.getAllDeviceGroup(0, 10).subscribe({
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
