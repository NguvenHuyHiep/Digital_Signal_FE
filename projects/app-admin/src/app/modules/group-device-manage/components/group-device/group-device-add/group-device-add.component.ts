import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormGroupDevice} from "../../group-device-type";
import {FormBuilder} from "@angular/forms";
import {AdminGroupDeviceService} from "../../../../../../../../app-api/src/lib/modules/admin/group-device/admin-group-device.service";
import {DeviceGroup} from "../../../../../../../../app-api/src/lib/api/models/deviceGroup";

@Component({
  selector: 'app-admin-group-device-add',
  templateUrl: './group-device-add.component.html',
  styleUrls: ['./group-device-add.component.scss'],
  providers: [AdminGroupDeviceService]
})
export class GroupDeviceAddComponent implements OnInit, OnChanges{
  @Input() groupDeviceAdmin?: DeviceGroup

  form: FormGroupDevice = this.groupDeviceService.buildGroupDeviceForm(this.groupDeviceAdmin)

  tabs = [
    {
      code: 'info',
      name: 'module.groupdevice.info',
    },
    {
      code: 'device',
      name: 'module.groupdevice.device',
    }
  ]

  constructor(
      private formBuilder: FormBuilder,
      private groupDeviceService: AdminGroupDeviceService
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
  }
}
