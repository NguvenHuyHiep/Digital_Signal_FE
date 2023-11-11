import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { User } from '../../../api/models/user';
import { AdminUsersAPIService } from '../../../api/controller/adminUsersAPI.service';
import {HttpParams} from "@angular/common/http";
import {tap} from "rxjs/operators";
import {FormGroupUser} from "../../../../../../app-admin/src/app/modules/user/components/user-type";
import {BaseOutputUser} from "../../../api/models/baseOutputUser";
import {BaseOutputString} from "../../../api/models/baseOutputString";

@Injectable()
export class AdminUserService {
  constructor(
    private adminUsersAPIService: AdminUsersAPIService,
    private formBuilder: FormBuilder
  ) {}

  public buildUserForm(user?: User): FormGroupUser {
    let form = this.formBuilder.group({
      id: [user?.id || ''],
      userName: [user?.userName || ''],
      password: [user?.password || ''],
      email: [user?.email || ''],
      phone: [user?.phone || ''],
      firstName: [user?.firstName || ''],
      lastName: [user?.lastName || ''],
      // license: this.formBuilder.group({
      //   code: [user?.license?.code]
      // }),
    }) as unknown as FormGroupUser; //TODO về sau bỏ unknown as đúng dạng

    return form;
  }

  public getAllUserByPaging(
    page?: number,
    size?: number,
    sortBy?: string,
    sortDirection?: string,
    keyword?: string
  ) {
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
    return this.adminUsersAPIService.getAllByPaging()
      .pipe(tap(response => console.log(response)))
  };

  public addUser(user: User): Observable<BaseOutputUser> {
    return this.adminUsersAPIService.create(user)
  }

  public updateUser(user: User): Observable<BaseOutputUser> {
    return this.adminUsersAPIService.update(user.id as number ,user)
  }

  public deleteUser(user: number): Observable<BaseOutputString> {
    return this.adminUsersAPIService._delete(user)
  }

}
