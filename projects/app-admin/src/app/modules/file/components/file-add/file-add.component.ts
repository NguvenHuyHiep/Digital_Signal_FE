import {Component, Input} from '@angular/core';
import {DeviceGroup} from "../../../../../../../app-api/src/lib/api/models/deviceGroup";
import {DsdFile} from "../../../../../../../app-api/src/lib/api/models/dsdFile";
import {Observable} from "rxjs";
import {FormGroupFile, FormGroupUploadRequest} from "../../../playlists/components/playlist";
import {
  AdminFileControllerService
} from "../../../../../../../app-api/src/lib/api/controller/adminFileController.service";
import {AdminFileService} from "../../../../../../../app-api/src/lib/modules/admin/admin-file/admin-file.service";
import {BaseOutputDsdFile} from "../../../../../../../app-api/src/lib/api/models/baseOutputDsdFile";
import {Device} from "../../../../../../../app-api/src/lib/api/models/device";
import {User} from "../../../../../../../app-api/src/lib/api/models/user";
import {UploadRequest} from "../../../../../../../app-api/src/lib/api/models/uploadRequest";

@Component({
  selector: 'app-admin-file-add',
  templateUrl: './file-add.component.html',
  styleUrls: ['./file-add.component.scss']
})
export class FileAddComponent {
  @Input() fileAdmin?: DsdFile;

form: FormGroupFile = this.adminFileService.buildFileForm(this.fileAdmin)

  constructor(private adminFileControllerService: AdminFileControllerService
             ,private adminFileService: AdminFileService) {
  }
  addOrUpdate() {
  }

}
