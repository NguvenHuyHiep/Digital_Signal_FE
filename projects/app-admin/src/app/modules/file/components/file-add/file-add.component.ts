import { Component, Input } from '@angular/core';
import { DeviceGroup } from '../../../../../../../app-api/src/lib/api/models/deviceGroup';
import { DsdFile } from '../../../../../../../app-api/src/lib/api/models/dsdFile';
import {
  Observable,
  Subscription,
  concatMap,
  map,
  mergeMap,
  tap,
  toArray,
} from 'rxjs';
import {
  FormGroupFile,
  FormGroupUploadRequest,
} from '../../../playlists/components/playlist';
import { AdminFileControllerService } from '../../../../../../../app-api/src/lib/api/controller/adminFileController.service';
import { AdminFileService } from '../../../../../../../app-api/src/lib/modules/admin/admin-file/admin-file.service';
import { BaseOutputDsdFile } from '../../../../../../../app-api/src/lib/api/models/baseOutputDsdFile';
import { Device } from '../../../../../../../app-api/src/lib/api/models/device';
import { User } from '../../../../../../../app-api/src/lib/api/models/user';
import { UploadRequest } from '../../../../../../../app-api/src/lib/api/models/uploadRequest';
import {
  NzUploadChangeParam,
  NzUploadFile,
  NzUploadXHRArgs,
} from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BaseOutputListDsdFile } from 'projects/app-api/src/lib/api/models/baseOutputListDsdFile';
import {
  LhTableConfigModel,
  LhTableFieldType,
} from 'projects/app-common/src/lib/components/lh-table/lh-table-config.model';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-admin-file-add',
  templateUrl: './file-add.component.html',
  styleUrls: ['./file-add.component.scss'],
})
export class FileAddComponent {
  @Input() control?: FormControl<string | null>;
  @Input() fileList: NzUploadFile[] = [];
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
