import {Injectable} from '@angular/core';
import {AdminFileControllerService} from "../../../api/controller/adminFileController.service";
import {Observable} from "rxjs";
import {HttpParams} from "@angular/common/http";
import {tap} from "rxjs/operators";
import {UploadRequest} from "../../../api/models/uploadRequest";
import {BaseOutputDsdFile} from "../../../api/models/baseOutputDsdFile";
import {DsdFile} from "../../../api/models/dsdFile";
import {FormBuilder} from "@angular/forms";
import {
  FormGroupFile,
  FormGroupUploadRequest
} from "../../../../../../app-admin/src/app/modules/playlists/components/playlist";

@Injectable({
  providedIn: 'root'
})
export class AdminFileService {

  constructor(private adminFileControllerService: AdminFileControllerService
    , private formBuilder: FormBuilder
  ) {
  }


  public deleteFile(path: string): Observable<any> {
    return this.adminFileControllerService.delete5(path);
  }

  public getAllFile(page?: number,
                    size?: number,
                    sortBy?: string,
                    sortDirection?: string,
                    keyword?: string) {
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
    if (keyword) {
      params = params.set('keyword', keyword);
    }
    return this.adminFileControllerService.getByPaging6(0, 100, 'id', 'DESC')
      .pipe(tap(response => console.log(response)));
  }

  public addPlayList(uploadRequest: UploadRequest): Observable<BaseOutputDsdFile> {
    return this.adminFileControllerService.upload(uploadRequest);
  }

  buildFileForm(file?: DsdFile): FormGroupFile {
    let form = this.formBuilder.group({
      id: [file?.id],
      path: [file?.path]
    }) as FormGroupFile
    return form;
  }


}
