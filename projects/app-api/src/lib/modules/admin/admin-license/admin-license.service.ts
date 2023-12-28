import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroupLicense } from '@app-admin/app/modules/license/components/license-type';
import { AdminLicenseApiService } from '@app-api/lib/api/apis/admin/admin-license.api.service';
import { BaseOutputLicense } from '@app-api/lib/api/models/baseOutputLicense';
import { License } from '@app-api/lib/api/models/license';
import { LicenseGenerateRequest } from '@app-api/lib/api/models/licenseGenerateRequest';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AdminLicenseService {
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
    request: LicenseGenerateRequest
  ): Observable<BaseOutputLicense> {
    return this.adminLicenseAPIService.generate(
      request.email as string,
      request.duration as number
    );
  }
}
