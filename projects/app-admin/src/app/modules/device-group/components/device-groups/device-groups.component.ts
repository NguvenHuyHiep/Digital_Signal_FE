import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {DeviceGroup} from "../../../../../../../app-api/src/lib/api/models/deviceGroup";
import {LhTableComponent} from "../../../../../../../app-common/src/lib/components/lh-table/lh-table.component";
import {DeviceGroupAddComponent} from "../device-group/device-group-add/device-group-add.component";
import {
  LhTableConfigModel,
  LhTableFieldType
} from "../../../../../../../app-common/src/lib/components/lh-table/lh-table-config.model";
import {NzMessageService} from "ng-zorro-antd/message";
import {translate} from "@antv/g2/lib/util/transform";
import {
  AdminDeviceGroupService
} from "../../../../../../../app-api/src/lib/modules/admin/group-device/admin-group-device.service";
import {Device} from "../../../../../../../app-api/src/lib/api/models/device";

@Component({
  selector: 'app-admin-device-groups',
  templateUrl: './device-groups.component.html',
  styleUrls: ['./device-groups.component.scss']
})
export class DeviceGroupsComponent implements OnInit{
  @ViewChild('table') table?: LhTableComponent<DeviceGroup>
  @ViewChild('addComponent', {static: false}) addComponent?: DeviceGroupAddComponent;
  devices: Array<Device> = [];
  showFrame: {
    search: boolean,
    add: boolean,
    device: boolean
  } = {
    search: true,
    add: false,
    device: false
  }
  currentDeviceGroup: DeviceGroup = {};
  deviceGroups: Array<DeviceGroup> = [];
  loading: {
    adding: boolean;
    searching: boolean;
    device: boolean
  } = {
    adding: false,
    searching: false,
    device: false
  };
  tableConfig: LhTableConfigModel = {
    disableDetail: true,
    key: 'id',
    fields: [
      {
        label: 'module.groupdevice.name'
        , field: 'name'
        , type: LhTableFieldType.STRING
      },
      {
        label: 'module.groupdevice.description'
        , field: 'description'
        , type: LhTableFieldType.STRING
      }
    ]
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

  constructor(private adminDeviceGroupService: AdminDeviceGroupService
    , private message: NzMessageService
  ) {
  }
  ngOnInit(): void {
    this.getAllDeviceGroup();
  }
  private getAllDeviceGroup() {
    this.adminDeviceGroupService.getAllDeviceGroup(0,10).subscribe({
      next: (response) => {
        if (response.data) {
          this.deviceGroups = response.data as Array<DeviceGroup>;
          console.log(this.deviceGroups + "DeviceGroup");
        }
      }
      , error: err => {
        // TODO i18n
        this.message.error("Error", err);
        this.loading.searching = false;
      }
      , complete: () => {
        this.loading.searching = false;
      }
    });
  }
  add() {
    if (!this.addComponent) {
      return;
    }
    this.loading.adding = true;
    this.addComponent.addOrUpdate().subscribe({
      next: (response) => {
        if(response.data){
          this.currentDeviceGroup = response.data;
          this.getAllDeviceGroup()
          this.showFrame.search = true;
          this.showFrame.add = false;
        }
      }  , error: err => {
        // TODO i18n
        this.message.error("Error", err);
        this.loading.searching = false;
      }
      , complete: () => {
        this.loading.adding = false;
      }
    })
  }

  openAddFrame() {
    this.currentDeviceGroup = {};
    this.showFrame.search = false;
    this.showFrame.add = true;
  }

  protected readonly translate = translate;
  get isSelectedRow(): boolean {
    return (this.table?.setOfCheckedId?.size || 0) > 0;
  }

  deleteSelected() {

  }
  update(record: DeviceGroup) {
    this.currentDeviceGroup = record;
    this.showFrame.add = true;
    this.showFrame.search = false;
  }

  delete(deviceGroup: DeviceGroup) {
    this.adminDeviceGroupService.deleteDeviceGroup(deviceGroup?.id as number).subscribe({
      next: response => {
        this.getAllDeviceGroup();
      }, error: err => {
        //TODO Xử lý exception
      }
      , complete: () => {
        this.loading.searching = false;
      }
    })
  }

  gotoSearch() {
    this.showFrame.search = true;
    this.showFrame.add = false;
  }
}
