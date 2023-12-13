import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormGroupLicense } from '@app-admin/app/modules/license/components/license-type';
import { License } from '@app-api/lib/api/models/license';
import { LicenseGenerateRequest } from '@app-api/lib/api/models/licenseGenerateRequest';
import { BaseOutputLicense } from '@app-api/lib/api/models/baseOutputLicense';
import { AdminLicenseAPIService } from '@app-api/lib/api';
import { AdminLicenseApiService } from './../../../api/apis/admin/admin-license.api.service';

@Injectable()
export class AdminLicenseService {
  AdminLicenseApiService: any;
  constructor(
    private formBuilder: FormBuilder,
    private adminLicenseAPIService: AdminLicenseApiService
  ) {}

  public getAllLicenseByPaging(
    page?: number,
    size?: number,
    sortBy?: string,
    sortDirection?: string
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
    return this.adminLicenseAPIService
      .getByPaging(0, 100, 'id', 'DESC')
      .pipe(tap((response) => console.log(response)));
  }

  public buildLicenseForm(license?: License): FormGroupLicense {
    let form = this.formBuilder.group({
      id: [license?.id],
      code: [license?.code || ''],
      token: [license?.token || ''],
      publicKey: [license?.publicKey || ''],
      activationDate: [
        license?.activationDate ? new Date(license.activationDate) : new Date(),
      ],
      expirationDate: [
        license?.expirationDate ? new Date(license.expirationDate) : new Date(),
      ],
      description: [license?.description || ''],
    }) as FormGroupLicense;

    return form;
  }

  public genLicense(
    email: LicenseGenerateRequest
  ): Observable<BaseOutputLicense> {
    return this.AdminLicenseApiService.generate(email, email.duration);
  }
}
