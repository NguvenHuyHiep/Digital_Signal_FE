import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {User} from "../../../../../../../app-api/src/lib/api/models/user";
import {FormBuilder} from "@angular/forms";
import {AdminUserService} from "../../../../../../../app-api/src/lib/modules/admin/admin-user/admin-user.service";
import {Observable} from "rxjs";
import {FormGroupUser} from "../user-type";
import {BaseOutputUser} from "../../../../../../../app-api/src/lib/api/models/baseOutputUser";
import {License} from "../../../../../../../app-api/src/lib/api/models/license";

@Component({
  selector: 'app-admin-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit, OnChanges{
  @Input() userAdmin?: User
  form: FormGroupUser = this.adminUserService.buildUserForm(this.userAdmin)

  licenses?: Array<License>;

  tabs = [
    {
      code: 'info',
      name: 'module.user.info',
    },
  ]

  constructor(
    private formBuilder: FormBuilder,
    private adminUserService: AdminUserService
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
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

}
