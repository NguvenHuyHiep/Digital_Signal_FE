import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { FormGroupFile } from '../../../playlists/components/playlist';
import { AdminFileService } from '../../../../../../../app-api/src/lib/modules/admin/admin-file/admin-file.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BaseOutputListDsdFile } from 'projects/app-api/src/lib/api/models/baseOutputListDsdFile';
import {
  LhTableConfigModel,
  LhTableFieldType,
} from 'projects/app-common/src/lib/components/lh-table/lh-table-config.model';
import { FormArray } from '@angular/forms';
import { DsdFile } from '../../../../../../../app-api/src/lib/api/models/dsdFile';
import { Location } from '@angular/common';
import { ResponseStatus } from 'projects/app-api/src/lib/api/models/responseStatus';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-file-add',
  templateUrl: './file-add.component.html',
  styleUrls: ['./file-add.component.scss'],
})
export class FileAddComponent {
  @Input() control?: FormArray<FormGroupFile>;
  @Input() fileList: NzUploadFile[] = [];
  @Input() fileAdmin?: DsdFile;
  tableConfig: LhTableConfigModel = {
    disableDetail: true,
    disableUpdate: true,
    key: 'uid',
    fields: [
      {
        label: 'module.file.name',
        field: 'name',
        type: LhTableFieldType.STRING,
      },
      {
        label: 'module.file.size',
        field: 'size',
        type: LhTableFieldType.SIZE_MEGABYTE,
      },
    ],
  };

  constructor(
    private location: Location,
    private msg: NzMessageService,
    private translateService: TranslateService,
    private adminFileService: AdminFileService
  ) {}

  beforeUpload = (file: NzUploadFile, fileList: NzUploadFile[]): boolean => {
    // de-duplicate file list
    const uniqueFileList = fileList.filter((i2) => {
      return !this.fileList.some(
        (i1) => i1.name === i2.name && i1.size === i2.size
      );
    });
    this.fileList = this.fileList.concat(uniqueFileList);
    return false; // Return false to stop automatic upload
  };

  deleteFile(file: NzUploadFile) {
    this.fileList = this.fileList.filter((f) => f !== file);
  }

  uploadFiles() {
    this.adminFileService.upload(this.fileList).subscribe({
      next: (value) => {
        console.log(value);
        this.msg.info(
          `${this.translateService.instant('module.file.upload.success')} ${
            value.data?.length ? value.data.length : 0
          }`
        );
      },
      error: (err) => {
        this.msg.error(
          this.translateService.instant('module.file.upload.error')
        );
        console.log(err);
      },
      complete: () => {},
    });
  }

  navigateToPrevious() {
    this.location.back();
  }
}
