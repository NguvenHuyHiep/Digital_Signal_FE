import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroupUser } from '../../../../../../app-admin/src/app/modules/user/components/user-type';
import { Observable } from 'rxjs';
import { AdminUserControllerService } from '../../../api/controller/adminUserController.service';
import {User} from "../../../api/models/user";
import {BaseOutputListUser} from "../../../api/models/baseOutputListUser";

@Injectable()
export class AdminUserService {
  constructor(
    private adminUserControllerService: AdminUserControllerService,
    private formBuilder: FormBuilder
  ) {}

  public buildUserForm(user?: User): FormGroupUser {
    let form = this.formBuilder.group({
      id: [user?.id || ''],
      userName: [user?.userName || ''],
      password: [user?.password || ''],
      email: [user?.email || ''],
      phone: [user?.phone || ''],
      roles: [user?.roles || ''],
      firstName: [user?.firstName || ''],
      lastName: [user?.lastName || ''],
    }) as FormGroupUser;

    return form;
  }

  public getAllUserByPaging(sortBy: string, sortDirection: string, keyword: string, page?: number, size?: number): Observable<BaseOutputListUser> {
    return this.adminUserControllerService.getAllByPaging(sortBy, sortDirection, keyword, page, size)
  }
}
