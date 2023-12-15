import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroupUser } from '@app-admin/app/modules/user/components/user-type';
import { AdminUsersAPIService } from '@app-api/lib/api';
import { AdminUserApiService } from '@app-api/lib/api/apis/admin/admin-user.api.service';
import { BaseOutputLicense } from '@app-api/lib/api/models/baseOutputLicense';
import { BaseOutputString } from '@app-api/lib/api/models/baseOutputString';
import { BaseOutputUser } from '@app-api/lib/api/models/baseOutputUser';
import { User } from '@app-api/lib/api/models/user';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AdminUserService {
  constructor(
    private adminUsersAPIService: AdminUserApiService,
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
    return this.adminUsersAPIService
      .getByPaging(
        page ?? 0,
        size ?? 100,
        sortBy ?? 'id',
        sortDirection ?? 'desc',
        keyword ?? ''
      )
      .pipe(tap((response) => console.log('response', response)));
  }

  public addUser(user: User): Observable<BaseOutputUser> {
    return this.adminUsersAPIService.create(user);
  }

  public updateUser(user: User): Observable<BaseOutputUser> {
    return this.adminUsersAPIService.update(user.id as number, user);
  }

  public deleteUser(user: number): Observable<BaseOutputString> {
    return this.adminUsersAPIService.deleteById(user);
  }

  public getUserByUserId(userId: number) {
    return this.adminUsersAPIService.getById(userId);
  }
  public getUserByEmail(email: string): Observable<BaseOutputUser> {
    return this.adminUsersAPIService.getByEmail(email);
  }

  public getLicenseByUser(userId: number): Observable<BaseOutputLicense> {
    return this.adminUsersAPIService.getById(userId);
  }
}
