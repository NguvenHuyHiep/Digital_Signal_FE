import {Component, OnInit, ViewChild} from '@angular/core';
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
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-admin-device-groups',
  templateUrl: './device-groups.component.html',
  styleUrls: ['./device-groups.component.scss']
})
export class DeviceGroupsComponent implements OnInit {
  @ViewChild('table') table?: LhTableComponent<DeviceGroup>
  @ViewChild('addComponent', {static: false}) addComponent?: DeviceGroupAddComponent;
  showFrame: {
    search: boolean,
    add: boolean
  } = {
    search: true,
    add: false
  }
  currentDeviceGroup?: DeviceGroup;
  deviceGroups: Array<DeviceGroup> = [];
  loading: {
    adding: boolean;
    searching: boolean;
  } = {
    adding: false,
    searching: false
  };
  query: {
    action?: string, id?: string
  } = {
    action: undefined
    , id: undefined
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
  protected readonly translate = translate;

  constructor(private route: ActivatedRoute, private router: Router
    , private adminDeviceGroupService: AdminDeviceGroupService
    , private message: NzMessageService
  ) {
  }

  get isSelectedRow(): boolean {
    return (this.table?.setOfCheckedId?.size || 0) > 0;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.query.action = params['action'];
      this.query.id = params['id'];
      switch (this.query.action) {
        case 'add': {
          this.currentDeviceGroup = undefined;
          this.openAddFrame();
          break;
        }
        case 'edit': {
          if (!this.query.id) {
            break;
          }
          if (this.currentDeviceGroup && this.currentDeviceGroup.id === Number(this.query.id)) {
            break;
          }
          this.adminDeviceGroupService.getDevices(Number(this.query.id)).subscribe({
            next: result => {
              if (result.data) {
                this.currentDeviceGroup = result.data;
                this.openAddFrame();
              }
            }
          });
          break;
        }
        default: {
          this.gotoSearch()
          break;
        }
      }
    });
    this.getAllDeviceGroup();
  }

  routeToSearch() {
    this.router.navigate([],).then(r => {

    });
  }

  routeToAdd() {
    const queryParams = {action: 'add'};
    this.router.navigate([], {queryParams}).then(r => {

    });
  }

  routeToEdit(id?: number) {
    const queryParams = {action: 'edit', id: id};
    this.router.navigate([], {queryParams}).then(r => {
    });
  }

  add() {
    if (!this.addComponent) {
      return;
    }
    this.loading.adding = true;
    this.addComponent.addOrUpdate().subscribe({
      next: (response) => {
        if (response.data) {
          this.currentDeviceGroup = response.data;
          if (this.query.action === 'add') {
            this.routeToEdit(response.data.id);
          }
          if (this.query.action === 'edit') {
            this.gotoSearch();
          }

        }
      }, error: err => {
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
    this.showFrame.search = false;
    this.showFrame.add = true;
  }

  deleteSelected() {

  }

  update(record: DeviceGroup) {
    this.currentDeviceGroup = record;
    this.routeToEdit(record.id);
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

    this.getAllDeviceGroup();
  }

  private getAllDeviceGroup() {
    this.adminDeviceGroupService.getAllDeviceGroup(0, 10).subscribe({
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
}

