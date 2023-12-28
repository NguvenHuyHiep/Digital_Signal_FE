import { HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroupFile } from '@app-admin/app/modules/playlists/components/playlist';
import { AdminFileApiService } from '@app-api/lib/api/apis/admin/admin-file.api.service';
import { BaseOutputDsdFile } from '@app-api/lib/api/models/baseOutputDsdFile';
import { BaseOutputListDsdFile } from '@app-api/lib/api/models/baseOutputListDsdFile';
import { BaseOutputString } from '@app-api/lib/api/models/baseOutputString';
import { DsdFile } from '@app-api/lib/api/models/dsdFile';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AdminFileService {
  constructor(
    private adminFileControllerService: AdminFileApiService,
    private formBuilder: FormBuilder
  ) {}

  public getFileByPaging(
    page?: number,
    size?: number,
    sortBy?: string,
    sortDirection?: string,
    keyword?: string
  ) {
    return this.adminFileControllerService.getByPaging(
      page ?? 0,
      size ?? 100,
      sortBy ?? 'id',
      sortDirection ?? 'DESC',
      keyword ?? ''
    );
  }

  public getById(id: number): Observable<BaseOutputDsdFile> {
    return this.adminFileControllerService.getById(id);
  }

  public getByPath(path: string): Observable<BaseOutputDsdFile> {
    return this.adminFileControllerService.getByPath(path);
  }

  public upload(
    files: NzUploadFile[]
  ): Observable<HttpEvent<BaseOutputListDsdFile>> {
    return this.adminFileControllerService.upload(files as any);
  }

  public download(dsdFile: DsdFile): Observable<Blob | undefined> {
    if (dsdFile && dsdFile.path) {
      return this.adminFileControllerService.download(dsdFile.path);
    }
    return of(undefined);
  }

  public deleteFile(path: string): Observable<BaseOutputString> {
    return this.adminFileControllerService.deleteByPath(path);
  }

  public buildFileForm(file?: DsdFile): FormGroupFile {
    let form = this.formBuilder.group({
      id: [file?.id],
      path: [file?.path],
    }) as FormGroupFile;
    return form;
  }

  public assignFileToPlaylists(
    fileId: number,
    playlistIds: number[]
  ): Observable<BaseOutputListDsdFile> {
    return this.adminFileControllerService.assignFileToPlaylists(
      fileId,
      playlistIds
    );
  }

  public removeFilesFromPlaylist(
    playlistId: number,
    fileIds: number[]
  ): Observable<BaseOutputString> {
    return this.adminFileControllerService.removeFilesFromPlaylist(
      playlistId,
      fileIds
    );
  }

  // public assignFilesToCategory(
  //   fileId: number,
  //   categoryId: number
  // ): Observable<BaseOutputListDsdFile> {
  //   return this.adminFileControllerService.assignFilesToPlaylist(
  //     fileId,
  //     categoryId
  //   );
  // }

  // public removeFilesFromCategory(
  //   categoryIds: number[]
  // ): Observable<BaseOutputString> {
  //   return this.adminFileControllerService.removeFileFromCategory(categoryIds);
  // }
}
