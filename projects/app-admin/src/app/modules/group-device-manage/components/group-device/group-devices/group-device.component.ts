import {Component, OnInit, ViewChild} from '@angular/core';
import {
    LhTableConfigModel,
    LhTableFieldType
} from "../../../../../../../../app-common/src/lib/components/lh-table/lh-table-config.model";
import {LhTableComponent} from "../../../../../../../../app-common/src/lib/components/lh-table/lh-table.component";
import {GroupDevice} from "../group-device.interface";
import {GroupDeviceAddComponent} from "../group-device-add/group-device-add.component";

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

    group: GroupDevice[] = [
        {id: '1', name: 'Techcombank', description: 'advertisement', location: 'Techcombank Tower - 191 Bà Triệu', deviceId: 'device1'},
        {id: '2', name: 'Group Device 2', description: 'advertisement', location: 'Location of Group 2', deviceId: 'device2'},
        {id: '3', name: 'Group Device 3', description: 'advertisement', location: 'Location of Group 3', deviceId: 'device3'},
    ];

    @ViewChild('table') table?: LhTableComponent<GroupDevice>
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

    currentGroupDevice?: GroupDevice;
    nameFilter?: string;
    locationFilter?: string;
    deviceIdFilter?: string;

    constructor() {
    }

    ngOnInit(): void {
        this.getAll();
    }

    getAll(): void {
        this.loading.searching = false
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

    detail(groupDevice: GroupDevice){
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

    update(groupDevice: GroupDevice) {
        this.currentGroupDevice = groupDevice;
        this.showFrame.add = true;
        this.showFrame.search = false;
    }

    delete() {
    }

    applyFilter() {
        let filteredData: GroupDevice[] = [...this.group];

        const nameFilter = (this.nameFilter || '').trim().toLowerCase();
        const locationFilter = (this.locationFilter || '').trim().toLowerCase();
        const deviceIdFilter = (this.deviceIdFilter || '').trim().toLowerCase();

        if (nameFilter) {
            filteredData = filteredData.filter((item) =>
                item.name.toLowerCase().includes(nameFilter)
            );
        }

        if (locationFilter) {
            filteredData = filteredData.filter((item) =>
                item.location.toLowerCase().includes(locationFilter)
            );
        }

        if (deviceIdFilter) {
            filteredData = filteredData.filter((item) => {
                item.location.toLowerCase().includes(locationFilter)
            });
        }

        if (this.table) {
            // this.table.setData(filteredData);
        }
    }

    protected readonly GroupDeviceAddComponent = GroupDeviceAddComponent;
}
