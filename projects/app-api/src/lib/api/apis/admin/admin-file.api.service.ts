import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseOutputDsdFile } from '../../models/baseOutputDsdFile';
import { BaseOutputListDsdFile } from '../../models/baseOutputListDsdFile';
import { BaseOutputString } from '../../models/baseOutputString';

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

  public getById(id: number): Observable<BaseOutputDsdFile> {
    return this.http.get<BaseOutputDsdFile>(`/api/v1/admin/file/${id}`, {
      params: {
        id,
      },
    });
  }

  public getByPath(path: string): Observable<BaseOutputDsdFile> {
    return this.http.get<BaseOutputDsdFile>(`/api/v1/admin/file/path/${path}`, {
      params: {
        path,
      },
    });
  }

  public download(path: string): Observable<BaseOutputDsdFile> {
    return this.http.get<BaseOutputDsdFile>(
      `/api/v1/admin/file/download/${path}`,
      {
        params: {
          path,
        },
      }
    );
  }

  public deleteByPath(path: string): Observable<BaseOutputString> {
    return this.http.delete<BaseOutputString>(`api/v1/admin/file/${path}`, {
      params: {
        path,
      },
    });
  }

  public deleteFromSource(path: string): Observable<BaseOutputString> {
    return this.http.delete<BaseOutputString>(
      `api/v1/admin/file/from-source/${path}`,
      {
        params: {
          path,
        },
      }
    );
  }

  public deleteFromDatabase(path: string): Observable<BaseOutputString> {
    return this.http.delete<BaseOutputString>(
      `api/v1/admin/file/from-database/${path}`,
      {
        params: {
          path,
        },
      }
    );
  }

  public upload(files: []): Observable<BaseOutputListDsdFile> {
    return this.http.post<BaseOutputListDsdFile>(`/api/v1/admin/file/upload`, {
      params: {
        files,
      },
    });
  }

  public assignFileToPlaylist(
    fileId: number,
    playlistId: number
  ): Observable<BaseOutputListDsdFile> {
    return this.http.put<BaseOutputListDsdFile>(
      `/api/v1/admin/file/{fileId}/playlist/{playlistId}`,
      {
        params: {
          fileId,
          playlistId,
        },
      }
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

  public removeFileFromPlaylist(
    playlistIds: number[]
  ): Observable<BaseOutputString> {
    return this.http.put<BaseOutputString>(
      `/api/v1/admin/file/remove/playlist/{playlistId}`,
      playlistIds,
      {
        params: {
          playlistIds,
        },
      }
    );
  }

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
