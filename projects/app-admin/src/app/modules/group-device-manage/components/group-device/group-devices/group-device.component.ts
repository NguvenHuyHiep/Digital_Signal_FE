import {Component, OnInit, ViewChild} from '@angular/core';
import {
  LhTableConfigModel,
  LhTableFieldType
} from "../../../../../../../../app-common/src/lib/components/lh-table/lh-table-config.model";
import {LhTableComponent} from "../../../../../../../../app-common/src/lib/components/lh-table/lh-table.component";
import {GroupDeviceAddComponent} from "../group-device-add/group-device-add.component";
import {
  AdminGroupDeviceService
} from "../../../../../../../../app-api/src/lib/modules/admin/group-device/admin-group-device.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {LhAuthenService} from "../../../../../../../../app-api/src/lib/modules/authen/lh-authen.service";
import {DeviceGroup} from "../../../../../../../../app-api/src/lib/api/models/deviceGroup";

@Component({
  selector: 'app-admin-group-device',
  templateUrl: './group-device.component.html',
  styleUrls: ['./group-device.component.scss']
})
export class GroupDeviceComponent implements OnInit {
  showFrame: {
    search: boolean,
    add: boolean
  } = {
    search: true,
    add: false
  }
  showList: {
    show: boolean,
  } = {
    show: true,
  }
  currentGroupDevice?: DeviceGroup;
  nameFilter?: string;
  locationFilter?: string;
  deviceIdFilter?: string;
  groupDevices: Array<DeviceGroup> = [];
  @ViewChild('table') table?: LhTableComponent<DeviceGroup>
  @ViewChild('addComponent', {static: false}) addComponent?: GroupDeviceAddComponent;
  loading: {
    adding: boolean;
    searching: boolean;
  } = {
    adding: false,
    searching: false
  };

  tableConfig: LhTableConfigModel = {
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
      },
      {
        label: 'module.groupdevice.location'
        , field: 'location'
        , type: LhTableFieldType.STRING
      },
    ]
  };
  protected readonly GroupDeviceAddComponent = GroupDeviceAddComponent;

  constructor(private groupDivceService: AdminGroupDeviceService
    , private message: NzMessageService
    , private authenService: LhAuthenService) {
  }

  ngOnInit(): void {
    this.getAllGroupDevice();
  }

  getAllGroupDevice(): void {
    this.loading.searching = true
    this.groupDivceService.getAllGroupDevice(0,10).subscribe({
      next: (response) => {
        if (response.data) {
          this.groupDevices = response.data as Array<DeviceGroup> ;
          console.log(this.groupDevices + "playlist");
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

  gotoSearch() {
    this.showFrame.search = true;
    this.showFrame.add = false;
  }

  openAddFrame() {
    this.currentGroupDevice = undefined;
    this.showFrame.search = false;
    this.showFrame.add = true;
  }

  detail(groupDevice: DeviceGroup) {
    this.currentGroupDevice = groupDevice;
    this.showList.show = true;
  }

  add() {
    if (!this.addComponent) {
      return;
    }
    this.loading.adding = true;
    this.loading.searching = false;
  }

  update(groupDevice: DeviceGroup) {
    this.currentGroupDevice = groupDevice;
    this.showFrame.add = true;
    this.showFrame.search = false;
  }

  delete() {
  }

  // applyFilter() {
  //   let filteredData: GroupDevice[] = [...this.group];
  //
  //   const nameFilter = (this.nameFilter || '').trim().toLowerCase();
  //   const locationFilter = (this.locationFilter || '').trim().toLowerCase();
  //   const deviceIdFilter = (this.deviceIdFilter || '').trim().toLowerCase();
  //
  //   if (nameFilter) {
  //     filteredData = filteredData.filter((item) =>
  //       item.name.toLowerCase().includes(nameFilter)
  //     );
  //   }
  //
  //   if (locationFilter) {
  //     filteredData = filteredData.filter((item) =>
  //       item.location.toLowerCase().includes(locationFilter)
  //     );
  //   }
  //
  //   if (deviceIdFilter) {
  //     filteredData = filteredData.filter((item) => {
  //       item.location.toLowerCase().includes(locationFilter)
  //     });
  //   }
  //
  //   if (this.table) {
  //     // this.table.setData(filteredData);
  //   }
  // }
}
