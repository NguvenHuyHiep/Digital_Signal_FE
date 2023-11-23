import { Component, OnInit } from '@angular/core';
import { User } from '../../../../../../../app-api/src/lib/api/models/user';
import { FormBuilder } from '@angular/forms';
import { AdminUserService } from '../../../../../../../app-api/src/lib/modules/admin/admin-user/admin-user.service';
import { Observable } from 'rxjs';
import { FormGroupUser } from '../user-type';
import { BaseOutputUser } from '../../../../../../../app-api/src/lib/api/models/baseOutputUser';
import { AdminLicenseService } from '../../../../../../../app-api/src/lib/modules/admin/admin-license/admin-license.service';
import { LicenseGenerateRequest } from '../../../../../../../app-api/src/lib/api/models/licenseGenerateRequest';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ResponseStatus } from '../../../../../../../app-api/src/lib/api/models/responseStatus';

@Component({
  selector: 'app-admin-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss'],
})
export class UserAddComponent implements OnInit {
  userId: number | undefined;
  currentUser?: User;
  license = '';

  form: FormGroupUser = this.adminUserService.buildUserForm(this.currentUser);

  loading: {
    adding: boolean;
    searching: boolean;
  } = {
    adding: false,
    searching: false,
  };
  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private adminUserService: AdminUserService,
    private adminLicenseService: AdminLicenseService,
    private translateService: TranslateService,
    private message: NzMessageService
  ) {
    this.userId = this.activatedRoute.snapshot.params['userId'];
  }

  ngOnInit(): void {
    if (this.userId) {
      // update
      this.getUserById(this.userId);
    } else {
      // create
    }
  }
  getUserById(userId: number) {
    this.loading.searching = true;
    this.adminUserService.getUserByUserId(userId).subscribe({
      next: (response) => {
        if (response && response.status === ResponseStatus.Success) {
          this.currentUser = response.data;
          this.form.patchValue(this.currentUser as any);
          this.license = this.currentUser?.license?.code || '';
          console.log('ngOnInit', this.form.value);
          console.log('license', this.license);
        } else {
          let errorsInStr: string = response.errors
            ?.map((e) => this.translateService.instant(e))
            .join(', ') as string;
          this.message.error(errorsInStr);
        }
      },
      error: (err) => {},
      complete: () => {
        this.loading.searching = false;
      },
    });
  }
  addOrUpdateUser(): Observable<BaseOutputUser> {
    if (!this.form.valid) {
      this.form.markAsTouched();
      this.form.markAsDirty();
    }
    if (!this.currentUser?.id && !this.form.controls.id?.value) {
      let addObj: User = {
        userName: this.form.controls.userName?.value,
        password: this.form.controls.password?.value,
        email: this.form.controls.email?.value,
        phone: this.form.controls.phone?.value,
        firstName: this.form.controls.firstName?.value,
        lastName: this.form.controls.lastName?.value,
      };
      return this.adminUserService.addUser(addObj);
    }
    let uptObj: User = {
      id: this.form.controls.id?.value || this.currentUser?.id,
      userName: this.form.controls.userName?.value,
      password: this.form.controls.password?.value,
      email: this.form.controls.email?.value,
      phone: this.form.controls.phone?.value,
      firstName: this.form.controls.firstName?.value,
      lastName: this.form.controls.lastName?.value,
      license: this.currentUser?.license,
    };
    return this.adminUserService.updateUser(uptObj);
  }

  genLicense(): void {
    let licenseGenerateRequest: LicenseGenerateRequest = {
      email: this.currentUser?.email,
      duration: 1000 * 60 * 60 * 24,
    };
    this.adminLicenseService
      .genLicense(licenseGenerateRequest)
      .subscribe((response) => {
        if (response && response.data) {
          if (this.currentUser) {
            this.currentUser.license = response.data;
            this.license = response.data.code || '';
          }
        }
      });
    console.log(this.license);
  }

  addOrUpdate() {
    if (!this.form) {
      return;
    }
    this.loading.adding = true;
    this.addOrUpdateUser().subscribe({
      next: (response) => {
        if (response && response.status === ResponseStatus.Success) {
          this.currentUser = response.data;
          this.message.create(
            'success',
            this.translateService.instant('common.success')
          );
        } else {
          let errorsInStr: string = response.errors
            ?.map((e) => this.translateService.instant(e))
            .join(', ') as string;
          this.message.error(errorsInStr);
        }
      },
      error: (err) => {
        this.message.create(
          'error',
          err.message
            ? err.message
            : this.translateService.instant('common.error')
        );
        console.log(err);
      },
      complete: () => {
        this.loading.adding = false;
        this.message.create('success', 'Thêm mới thành công');
        this.location.back();
      },
    });
  }

  navigateToPrevious = (): void => {
    this.location.back();
  };
}
