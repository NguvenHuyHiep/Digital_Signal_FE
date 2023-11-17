import { Component, OnInit, ViewChild } from '@angular/core';
import { LhTableComponent } from '../../../../../../../app-common/src/lib/components/lh-table/lh-table.component';
import { License } from '../../../../../../../app-api/src/lib/api/models/license';
import {
  LhTableConfigModel,
  LhTableFieldType,
} from '../../../../../../../app-common/src/lib/components/lh-table/lh-table-config.model';
import { AdminLicenseService } from '../../../../../../../app-api/src/lib/modules/admin/admin-license/admin-license.service';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-admin-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.scss'],
})
export class LicenseComponent implements OnInit {
  @ViewChild('table') table?: LhTableComponent<License>;
  showFrame: {
    search: boolean;
    add: boolean;
  } = {
    search: true,
    add: false,
  };

  licenses: Array<License> = [];

  loading: {
    adding: boolean;
    searching: boolean;
  } = {
    adding: false,
    searching: false,
  };

  tableConfig: LhTableConfigModel = {
    key: 'id',
    disableUpdate: true,
    disableDelete: true,
    fields: [
      {
        label: 'license-detail.license.code',
        field: 'code',
        type: LhTableFieldType.STRING,
      },
      {
        label: 'license-detail.license.activationDate',
        field: 'activationDate',
        type: LhTableFieldType.DATE_TIME,
      },
      {
        label: 'license-detail.license.expirationDate',
        field: 'expirationDate',
        type: LhTableFieldType.DATE_TIME,
      },
      {
        label: 'license-detail.license.description',
        field: 'description',
        type: LhTableFieldType.STRING,
      },
    ],
  };

  constructor(
    private adminLicenseService: AdminLicenseService,
    private translateService: TranslateService,
    private message: NzMessageService
  ) {}

  get isSelectedRow(): boolean {
    return (this.table?.setOfCheckedId?.size || 0) > 0;
  }

  ngOnInit(): void {
    this.getAll();
  }

  getAll(): void {
    this.loading.searching = true;
    this.adminLicenseService.getAllLicenseByPaging(5, 10).subscribe({
      next: (response) => {
        if (response.data) {
          this.licenses = response.data as Array<License>;
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
        this.loading.searching = false;
      },
    });
  }
}
