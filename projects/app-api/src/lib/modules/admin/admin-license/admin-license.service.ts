import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { License } from '../../../api/models/license';
import {AdminLicenseAPIService} from "../../../api/controller/adminLicenseAPI.service";
import {HttpParams} from "@angular/common/http";
import {tap} from "rxjs/operators";
import {Observable} from "rxjs";
import {BaseOutputLicense} from "../../../api/models/baseOutputLicense";
import {BaseOutputString} from "../../../api/models/baseOutputString";
import {FormGroupLicense} from "../../../../../../app-admin/src/app/modules/license/components/license-type";

@Injectable()
export class AdminLicenseService {
  constructor(
    private formBuilder: FormBuilder,
    private adminLicenseAPIService: AdminLicenseAPIService
    ) {}

  public getAllLicenseByPaging(
    page?: number,
    size?: number,
    sortBy?: string,
    sortDirection?: string,
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
    return this.adminLicenseAPIService.getByPaging5()
      .pipe(tap(response => console.log(response)))
  };

  public addLicense(license: License): Observable<BaseOutputLicense> {
    return this.adminLicenseAPIService.create4(license);
  }

  public updateLicense(license: License): Observable<BaseOutputLicense> {
    return this.adminLicenseAPIService.update4(license.id as number, license);
  }

  public deleteLicense(license: number): Observable<BaseOutputString> {
    return this.adminLicenseAPIService.delete4(license)
  }

  public buildLicenseForm(license?: License): FormGroupLicense {
    let form = this.formBuilder.group({
      id: [license?.id],
      code: [license?.code || ''],
      token: [license?.token || ''],
      publicKey: [license?.publicKey || ''],
      activationDate: [license?.activationDate ? new Date(license.activationDate) : new Date()],
      expirationDate: [license?.expirationDate ? new Date(license.expirationDate) : new Date()],
      description: [license?.description || ''],
    }) as FormGroupLicense

    return form;
  }
}
