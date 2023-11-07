import {Injectable} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {License} from "../../../../../../app-admin/src/app/modules/license/components/license/license.interface";
import {FormGroupLicense} from "../../../../../../app-admin/src/app/modules/license/components/license-type";

@Injectable()
export class AdminLicenseService {
  constructor(private formBuilder: FormBuilder) {
  }

  public buildLicenseForm(license?: License): FormGroupLicense {
    let form = this.formBuilder.group({
      id: [license?.id || ''],
      name: [license?.name || ''],
      deviceLimit: [license?.deviceLimit || ''],
      expireTime: [license?.expireTime || ''],
    }) as FormGroupLicense

    return form;
  }
}
