import { Component, Input } from '@angular/core';
import { FormArray } from '@angular/forms';
import { FormGroupFile } from '@app-admin/app/modules/playlists/components/playlist';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { DsdFile } from '@app-api/lib/api/models/dsdFile';
import {
  LhTableConfigModel,
  LhTableFieldType,
} from '@app-common/lib/components/lh-table/lh-table-config.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateService } from '@ngx-translate/core';
import { AdminFileService } from '@app-api/lib/modules/admin/admin-file/admin-file.service';
import { Location } from '@angular/common';
import { ResponseStatus } from '@app-api/lib/api/models/responseStatus';

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

  isLoading: boolean = false;

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
    if (!this.fileList || this.fileList.length === 0) {
      this.msg.info(
        this.translateService.instant('module.file.upload.file-empty')
      );
      return;
    }

    this.isLoading = true;
    this.adminFileService.upload(this.fileList).subscribe({
      next: (response) => {
        console.log(response);
        if (response && response.status === ResponseStatus.Success) {
          this.msg.info(
            `${this.translateService.instant('module.file.upload.success')} ${
              response.data?.length ? response.data.length : 0
            }`
          );
          this.fileList = this.filterDuplicatedItem(
            this.fileList,
            response.data as DsdFile[]
          );
        } else {
          let errorsInStr: string = response.errors
            ?.map((e) => this.translateService.instant(e))
            .join(', ') as string;
          this.msg.error(errorsInStr);
        }
      },
      error: (err) => {
        this.msg.error(
          this.translateService.instant('module.file.upload.error')
        );
        console.log(err);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  navigateToPrevious() {
    this.location.back();
  }

  private filterDuplicatedItem(fileList: NzUploadFile[], dsdFiles: DsdFile[]) {
    return fileList.filter(
      (uf) =>
        !dsdFiles
          .map((df) => df.path)
          .filter((fdp) => !!fdp)
          .includes(uf.name)
    );
  }
}
