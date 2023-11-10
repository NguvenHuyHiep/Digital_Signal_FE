import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {User} from "../../../../../../../app-api/src/lib/api/models/user";
import {FormBuilder} from "@angular/forms";
import {AdminUserService} from "../../../../../../../app-api/src/lib/modules/admin/admin-user/admin-user.service";
import {Observable} from "rxjs";
import {FormGroupUser} from "../user-type";
import {BaseOutputUser} from "../../../../../../../app-api/src/lib/api/models/baseOutputUser";
import {
  AdminLicenseService
} from "../../../../../../../app-api/src/lib/modules/admin/admin-license/admin-license.service";
import {BaseOutputLicense} from "../../../../../../../app-api/src/lib/api/models/baseOutputLicense";
import {LicenseGenerateRequest} from "../../../../../../../app-api/src/lib/api/models/licenseGenerateRequest";

@Component({
  selector: 'app-admin-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit, OnChanges {
  @Input() userAdmin?: User
  form: FormGroupUser = this.adminUserService.buildUserForm(this.userAdmin)
  tabs = [
    {
      code: 'info',
      name: 'module.user.info',
    },
  ]

  license?: string
  licenseGen?: LicenseGenerateRequest

  isValue?: string;

  constructor(
    private formBuilder: FormBuilder,
    private adminUserService: AdminUserService,
    private adminLicenService: AdminLicenseService
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    let currentValue = changes['user'].currentValue as User;
    if (currentValue) {
      this.form.patchValue(currentValue as any);
      console.log('this.form', this.form.value);
      this.form.controls.id?.setValue(
        currentValue.id as number
      )
    }
    console.log('this.form', this.form.value);
  }

  ngOnInit(): void {
    if (this.userAdmin) {
      this.form.patchValue(this.userAdmin as any);
      console.log('ngOnInit', this.form.value);
    }
    this.form.controls
    this.form.valueChanges.subscribe((value) => {
      console.log('value', value)
    })
  }

  addUser(): Observable<BaseOutputUser> {
    if (!this.form.valid) {
      this.form.markAsTouched();
      this.form.markAsDirty();
    }
    if (!this.form.controls.id?.value) {
      let addObj: User = {
        id: this.form.controls.id?.value,
        userName: this.form.controls.userName?.value,
        password: this.form.controls.password?.value,
        email: this.form.controls.email?.value,
        phone: this.form.controls.phone?.value,
        firstName: this.form.controls.firstName?.value,
      };
      return this.adminUserService.addUser(addObj)
    }
    let uptObj: User = {
      id: this.form.controls.id?.value,
      userName: this.form.controls.userName?.value,
      password: this.form.controls.password?.value,
      email: this.form.controls.email?.value,
      phone: this.form.controls.phone?.value,
      firstName: this.form.controls.firstName?.value,
      lastName: this.form.controls.lastName?.value,
    };
    return this.adminUserService.updateUser(uptObj)
  }

  genLicense(): void {
    let licenseGenerateRequest: LicenseGenerateRequest = {
      email: this.userAdmin?.email,
      duration: 1000 * 60 * 60 * 24
    }
    this.adminLicenService.genLicense(licenseGenerateRequest).subscribe(response => {
      console.log(response);
      if (response && response.data) {
        if (this.userAdmin && this.userAdmin.license) {
          this.userAdmin.license = response.data;
        }
      }

    });
  }
}
