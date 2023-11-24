import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { FormBuilder } from '@angular/forms';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { AdminFileControllerService } from '@app-api/lib/api';
import { FormGroupFile } from '@app-admin/app/modules/playlists/components/playlist';
import { DsdFile } from '@app-api/lib/api/models/dsdFile';
import { BaseOutputListDsdFile } from '@app-api/lib/api/models/baseOutputListDsdFile';

@Injectable({
  providedIn: 'root',
})
export class AdminFileService {
  constructor(
    private adminFileControllerService: AdminFileControllerService,
    private formBuilder: FormBuilder
  ) {}

  public deleteFile(path: string): Observable<any> {
    return this.adminFileControllerService.delete5(path);
  }

  public getAllFile(
    page?: number,
    size?: number,
    sortBy?: string,
    sortDirection?: string,
    keyword?: string
  ) {
    return this.adminFileControllerService
      .getByPaging6(0, 100, 'id', 'DESC')
      .pipe(tap((response) => console.log(response)));
  }

  upload(files: NzUploadFile[]): Observable<BaseOutputListDsdFile> {
    return this.adminFileControllerService.uploadMultipleFiles(files as any);
  }

  buildFileForm(file?: DsdFile): FormGroupFile {
    let form = this.formBuilder.group({
      id: [file?.id],
      path: [file?.path],
    }) as FormGroupFile;
    return form;
  }
}
