import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroupFile } from '@app-admin/app/modules/playlists/components/playlist';
import { BaseOutputListDsdFile } from '@app-api/lib/api/models/baseOutputListDsdFile';
import { DsdFile } from '@app-api/lib/api/models/dsdFile';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseOutputString } from '@app-api/lib/api/models/baseOutputString';
import { AdminFileControllerService } from '@app-api/lib/api';

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

  public upload(files: NzUploadFile[]): Observable<BaseOutputListDsdFile> {
    return this.adminFileControllerService.uploadMultipleFiles(files as any);
  }

  public download(dsdFile: DsdFile): Observable<Blob | null> {
    if (dsdFile && dsdFile.path) {
      return this.adminFileControllerService.downloadByPath(dsdFile.path);
    }
    return of(null);
  }

  public buildFileForm(file?: DsdFile): FormGroupFile {
    let form = this.formBuilder.group({
      id: [file?.id],
      path: [file?.path],
    }) as FormGroupFile;
    return form;
  }
  public removeFilesFromPlaylist(
    requestBody: number[],
    playlistId: number
  ): Observable<BaseOutputString> {
    return this.adminFileControllerService.removeFilesFromPlaylist(
      playlistId,
      requestBody
    );
  }
}
