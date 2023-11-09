import {Component, Input, ViewChild} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {DeviceAddComponent} from "../../device/device-add/device-add.component";
import {Device} from "../../../../../../../../app-api/src/lib/api/models/device";
import {DeviceGroup} from "../../../../../../../../app-api/src/lib/api/models/deviceGroup";

@Component({
  selector: 'app-admin-group-device-content',
  templateUrl: './group-device-content.component.html',
  styleUrls: ['./group-device-content.component.scss']
})
export class GroupDeviceContentComponent {
  @Input() groupDevice?: DeviceGroup

  @ViewChild('deviceAddComponent', {static: false}) deviceAddComponent?: DeviceAddComponent;

  devices: Array<Device> = [];
  currentDevice?: Device

  showFrame: {
    addDevice?: boolean
  } = {
    addDevice: false
  }

  loading: {
    addDevice: boolean;
    deleteDevice: boolean;
    device: boolean;
  } = {
    addDevice: false
    , deleteDevice: false
    , device: false
  }

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    // this.loadDevices();
  }
  openAddDevice() {
    this.currentDevice = undefined;
    this.showFrame.addDevice = true;
  }

  cancelAddDevice() {
    this.currentDevice = undefined;
    this.showFrame.addDevice = false;
  }

  loadDevices(): void {
    this.loading.device = true;

  }

  addDevice() {}
  updateDevice(device: Device) {
    this.setCurrentDevice(device);
    this.showFrame.addDevice = true;

  }
  deleteDevice(device: Device) {
    this.loading.deleteDevice = true;

  }
  setCurrentDevice(device: Device) {
    if (!device) {
      this.currentDevice = device;
      return;
    }
    if (this.currentDevice?.id === device.id) {
      return;
    }
    this.currentDevice = device;
    this.loadDevices();
  }
}
