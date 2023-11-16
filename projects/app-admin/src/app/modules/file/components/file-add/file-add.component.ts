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
import { from, of } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BaseOutputListDsdFile } from 'projects/app-api/src/lib/api/models/baseOutputListDsdFile';

@Component({
  selector: 'app-admin-file-add',
  templateUrl: './file-add.component.html',
  styleUrls: ['./file-add.component.scss'],
})
export class FileAddComponent {
  @Input() fileList: NzUploadFile[] = [];

  // form: FormGroupFile = this.adminFileService.buildFileForm(this.fileAdmin)

  constructor(
    private msg: NzMessageService,
    private adminFileService: AdminFileService
  ) {}

  beforeUpload = (file: NzUploadFile, fileList: NzUploadFile[]): boolean => {
    // You can perform validations or add the file to the file list here
    this.fileList = this.fileList.concat(fileList);
    return false; // Return false to stop automatic upload
  };

  deleteFile(file: NzUploadFile) {
    this.fileList = this.fileList.filter((f) => f !== file);
  }

  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status === 'done') {
      console.log(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      console.error(`${info.file.name} file upload failed.`);
    }
  }

  uploadFiles(): Observable<BaseOutputListDsdFile> {
    return this.adminFileService.upload(this.fileList);

    // Call your service to upload files here
    // Example: this.fileUploadService.upload(formData).subscribe(...);
  }
}
