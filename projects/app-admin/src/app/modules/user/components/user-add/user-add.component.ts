import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {User} from "../../../../../../../app-api/src/lib/api/models/user";
import {FormBuilder} from "@angular/forms";
import {AdminUserService} from "../../../../../../../app-api/src/lib/modules/admin/admin-user/admin-user.service";
import {Observable} from "rxjs";
import {FormGroupUser} from "../user-type";

@Component({
  selector: 'app-admin-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit, OnChanges{
  @Input() userAdmin?: User
  form: FormGroupUser = this.adminUserService.buildUserForm(this.userAdmin)


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

  addUser() {
  // addUser(): Observable<User> {
  //   let addObj: User = {
  //     userName: this.form.controls.userName?.value,
  //
  //   };
  //

  }

}
