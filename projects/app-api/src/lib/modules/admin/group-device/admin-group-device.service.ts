import {Injectable} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {GroupDevice} from "../../../../../../app-admin/src/app/modules/group-device-manage/components/group-device/group-device.interface";
import {FormGroupDevice} from "../../../../../../app-admin/src/app/modules/group-device-manage/components/group-device-type";

@Injectable()
export class AdminGroupDeviceService {

  constructor(private formBuilder: FormBuilder) {
  }

  public buildGroupDeviceForm(groupdevice?: GroupDevice): FormGroupDevice {
    let form = this.formBuilder.group({
      id: [groupdevice?.id || ''],
      name: [groupdevice?.name || ''],
      description: [groupdevice?.description || ''],
      location: [groupdevice?.location || '']
    })  as FormGroupDevice

    return form;
  }
}
