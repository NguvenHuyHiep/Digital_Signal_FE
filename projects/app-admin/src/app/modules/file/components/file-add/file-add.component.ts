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
  // form: FormGroupFile = this.adminFileService.buildFileForm(this.fileAdmin)

  constructor(
    private msg: NzMessageService,
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

  uploadFiles(): Observable<BaseOutputListDsdFile> {
    return this.adminFileService.upload(this.fileList);
  }
}
