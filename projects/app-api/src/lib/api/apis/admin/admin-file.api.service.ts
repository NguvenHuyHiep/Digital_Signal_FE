import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseOutputDsdFile } from '../../models/baseOutputDsdFile';
import { BaseOutputListDsdFile } from '../../models/baseOutputListDsdFile';
import { BaseOutputString } from '../../models/baseOutputString';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { forEach } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class AdminFileApiService {
  constructor(private http: HttpClient) {}

  public getByPaging(
    page: number,
    size: number,
    sortBy: string,
    sortDirection: string,
    keyword: string
  ): Observable<BaseOutputListDsdFile> {
    return this.http.get<BaseOutputListDsdFile>(`/api/v1/admin/file`, {
      params: {
        page,
        size,
        sortBy,
        sortDirection,
        keyword,
      },
    });
  }

  public getByPlaylistIdAndPaging(
    playlistId: number,
    page: number,
    size: number,
    sortBy: string,
    sortDirection: string,
    keyword: string
  ): Observable<BaseOutputListDsdFile> {
    return this.http.get<BaseOutputListDsdFile>(
      `/api/v1/admin/file/playlist/${playlistId}`,
      {
        params: {
          page,
          size,
          sortBy,
          sortDirection,
          keyword,
        },
      }
    );
  }

  public getById(id: number): Observable<BaseOutputDsdFile> {
    return this.http.get<BaseOutputDsdFile>(`/api/v1/admin/file/${id}`);
  }

  public getByPath(path: string): Observable<BaseOutputDsdFile> {
    return this.http.get<BaseOutputDsdFile>(`/api/v1/admin/file/path`, {
      params: {
        path,
      },
    });
  }

  public download(path: string): Observable<Blob> {
    return this.http.get<Blob>(`/api/v1/admin/file/download`, {
      responseType: 'blob' as 'json',
      params: {
        path,
      },
    });
  }

  public deleteByPath(path: string): Observable<BaseOutputString> {
    return this.http.delete<BaseOutputString>(`/api/v1/admin/file`, {
      params: {
        path,
      },
    });
  }

  public upload(files: File[]): Observable<HttpEvent<BaseOutputListDsdFile>> {
    const formData = new FormData();
    forEach(files, (file) => {
      formData.append('files', file, file.name);
    });

    return this.http.post<BaseOutputListDsdFile>(
      `/api/v1/admin/file/upload`,
      formData,
      {
        reportProgress: true,
        observe: 'events',
      }
    );
  }

  public assignFileToPlaylists(
    fileId: number,
    playlistIds: number[]
  ): Observable<BaseOutputListDsdFile> {
    return this.http.put<BaseOutputListDsdFile>(
      `/api/v1/admin/file/${fileId}/playlists`,
      playlistIds
    );
  }

  public removeFilesFromPlaylist(
    playlistId: number,
    fileIds: number[]
  ): Observable<BaseOutputString> {
    return this.http.put<BaseOutputString>(
      `/api/v1/admin/file/remove/playlist/${playlistId}`,
      fileIds
    );
  }

  // public assignFileToCategory(
  //   fileId: number,
  //   categoryId: number
  // ): Observable<BaseOutputListDsdFile> {
  //   return this.http.put<BaseOutputListDsdFile>(
  //     `/api/v1/admin/file/{fileId}/category/{categoryId}`,
  //     {
  //       params: {
  //         fileId,
  //         categoryId,
  //       },
  //     }
  //   );
  // }

  // public removeFileFromCategory(
  //   categoryIds: number[]
  // ): Observable<BaseOutputListDsdFile> {
  //   return this.http.put<BaseOutputListDsdFile>(
  //     `/api/v1/admin/file/remove/category/{categoryId}`,
  //     {
  //       body: categoryIds,
  //     },
  //     body: categoryIds
  //   );
  // }
}
