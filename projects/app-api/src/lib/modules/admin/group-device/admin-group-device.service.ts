import {Injectable} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {
  FormGroupDevice
} from "../../../../../../app-admin/src/app/modules/group-device-manage/components/group-device-type";
import {AdminDeviceGroupControllerService} from "../../../api/controller/adminDeviceGroupController.service";
import {HttpParams} from "@angular/common/http";
import {tap} from "rxjs/operators";
import {DeviceGroup} from "../../../api/models/deviceGroup";

@Injectable()
export class AdminGroupDeviceService {

  constructor(private formBuilder: FormBuilder,
              private adminGroupDeviceController: AdminDeviceGroupControllerService) {
  }
  public buildGroupDeviceForm(deviceGroup?: DeviceGroup): FormGroupDevice {
    let form = this.formBuilder.group({
      id: [deviceGroup?.id],
      groupName: [deviceGroup?.name],
      description: [deviceGroup?.description],
    }) as FormGroupDevice
    return form;
  }
  public getAllGroupDevice(page?: number,
                        size?: number,
                        sortBy?: string,
                        sortDirection?: string,
                        keyword?: string) {
    let params = new HttpParams();

    // Thêm các tham số vào HttpParams nếu chúng được cung cấp
    if (page !== undefined && page !== null) {
      params = params.set('page', page.toString());
    }
    if (size !== undefined && size !== null) {
      params = params.set('size', size.toString());
    }
    if (sortBy) {
      params = params.set('sortBy', sortBy);
    }
    if (sortDirection) {
      params = params.set('sortDirection', sortDirection);
    }
    if (keyword) {
      params = params.set('keyword', keyword);
    }
    return this.adminGroupDeviceController.getByPaging9()
      .pipe(tap(response => console.log(response)));

  }

}
