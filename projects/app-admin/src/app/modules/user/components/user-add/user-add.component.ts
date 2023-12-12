import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { User } from '@app-api/lib/api/models/user';
import { FormGroupUser } from '@app-admin/app/modules/user/components/user-type';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdminUserService } from '@app-api/lib/modules/admin/admin-user/admin-user.service';
import { AdminLicenseService } from '@app-api/lib/modules/admin/admin-license/admin-license.service';
import { ResponseStatus } from '@app-api/lib/api/models/responseStatus';
import { Observable } from 'rxjs';
import { BaseOutputUser } from '@app-api/lib/api/models/baseOutputUser';
import { LicenseGenerateRequest } from '@app-api/lib/api/models/licenseGenerateRequest';

@Component({
  selector: 'app-admin-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss'],
})
export class UserAddComponent implements OnInit {
  userId: number | undefined;
  currentUser?: User;
  license = '';
  isVisible = false;
  timeLicenseForm: FormGroup = this.formBuilder.group({
    timeType: [''],
    timeValue: [''],
    isLifeTime: [false],
  });
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
    this.timeLicenseForm
      .get('isLifeTime')
      ?.valueChanges.subscribe((checked: boolean) => {
        if (checked) {
          this.timeLicenseForm.get('timeType')?.disable();
          this.timeLicenseForm.get('timeValue')?.disable();
        } else {
          this.timeLicenseForm.get('timeType')?.enable();
          this.timeLicenseForm.get('timeValue')?.enable();
        }
      });
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
    this.isVisible = true;
    this.timeLicenseForm.patchValue({
      timeType: 'day',
    });
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
        this.location.back();
      },
    });
  }

  navigateToPrevious = (): void => {
    this.location.back();
  };

  handleOk(): void {
    if (!this.currentUser?.email) {
      this.message.info(
        this.translateService.instant('module.user.error.invalid-email')
      );
      return;
    }

    let millisecondValue: number = NaN;
    if (this.timeLicenseForm.get('isLifeTime')?.value) {
      millisecondValue = 0;
    } else {
      const timeType = this.timeLicenseForm.get('timeType')?.value;
      const timeValue = this.timeLicenseForm.get('timeValue')?.value;
      millisecondValue = this.convertToMilliseconds(timeType, timeValue);
    }

    if (isNaN(millisecondValue)) {
      this.message.info(
        this.translateService.instant('module.user.error.invalid-time')
      );
      return;
    }

    let licenseGenerateRequest: LicenseGenerateRequest = {
      email: this.currentUser?.email,
      duration: millisecondValue,
    };

    this.adminLicenseService.genLicense(licenseGenerateRequest).subscribe({
      next: (response) => {
        if (response && response.data) {
          if (this.currentUser) {
            this.currentUser.license = response.data;
            this.license = response.data.code || '';
          }
        }
      },
      error: (err) => {
        this.isVisible = false;
        console.log(err);
      },
      complete: () => {
        this.isVisible = false;
      },
    });
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  convertToMilliseconds(timeType?: string, timeValue?: number): number {
    if (!timeType || !timeValue) {
      return NaN;
    }

    let multiplier = 1;
    if (timeType === 'day') {
      multiplier = 24 * 60 * 60 * 1000;
    } else if (timeType === 'hour') {
      multiplier = 60 * 60 * 1000;
    } else if (timeType === 'month') {
      multiplier = 30 * 24 * 60 * 60 * 1000;
    }
    return timeValue * multiplier;
  }
}
