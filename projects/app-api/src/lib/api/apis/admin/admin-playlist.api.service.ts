import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseOutputListPlaylist } from '../../models/baseOutputListPlaylist';
import { BaseOutputPlaylist } from '../../models/baseOutputPlaylist';
import { BaseOutputString } from '../../models/baseOutputString';
import { Playlist } from '../../models/playlist';

@Injectable({
  providedIn: 'root',
})
export class AdminPlaylistApiService {
  constructor(private http: HttpClient) {}

  public getById(id: number): Observable<BaseOutputPlaylist> {
    return this.http.get<BaseOutputPlaylist>(`/api/v1/admin/playlist/${id}`);
  }

  public getByPaging(
    page: number,
    size: number,
    sortBy: string,
    sortDirection: string,
    keyword: string
  ): Observable<BaseOutputListPlaylist> {
    return this.http.get<BaseOutputListPlaylist>(`/api/v1/admin/playlist`, {
      params: {
        page,
        size,
        sortBy,
        sortDirection,
        keyword,
      },
    });
  }

  public create(playlist: Playlist): Observable<BaseOutputPlaylist> {
    return this.http.post<BaseOutputPlaylist>(
      `/api/v1/admin/playlist`,
      playlist
    );
  }

  public update(
    id: number,
    playlist: Playlist
  ): Observable<BaseOutputPlaylist> {
    return this.http.put<BaseOutputPlaylist>(
      `/api/v1/admin/playlist/${id}`,
      playlist
    );
  }

  public delete(id: number): Observable<BaseOutputString> {
    return this.http.delete<BaseOutputString>(`/api/v1/admin/playlist/${id}`);
  }

  public deleteByIds(playlistIds: number[]): Observable<BaseOutputString> {
    return this.http.delete<BaseOutputString>(
      `/api/v1/admin/playlist/delete-playlists`,
      {
        body: playlistIds,
      }
    );
  }

  public updateStatus(
    playlistId: number,
    status: string
  ): Observable<BaseOutputPlaylist> {
    return this.http.put<BaseOutputPlaylist>(
      `/api/v1/admin/playlist/${playlistId}/update-status/${status}`,
      {}
    );
  }

  public getWithFiles(id: number): Observable<BaseOutputPlaylist> {
    return this.http.get<BaseOutputPlaylist>(
      `/api/v1/admin/playlist/${id}/files`
    );
  }

  public assignFiles(
    playlistId: number,
    fileIds: number[]
  ): Observable<BaseOutputPlaylist> {
    return this.http.put<BaseOutputPlaylist>(
      `/api/v1/admin/playlist/${playlistId}/files`,
      fileIds
    );
  }

  public removeFiles(
    playlistId: number,
    fileIds: number[]
  ): Observable<BaseOutputString> {
    return this.http.put<BaseOutputString>(
      `/api/v1/admin/playlist/${playlistId}/files`,
      fileIds
    );
  }

  public getWithDeviceGroups(id: number): Observable<BaseOutputPlaylist> {
    return this.http.get<BaseOutputPlaylist>(
      `/api/v1/admin/playlist/${id}/device-groups`
    );
  }

  public assignDeviceGroups(
    playlistId: number,
    deviceGroupIds: number[]
  ): Observable<BaseOutputPlaylist> {
    return this.http.put<BaseOutputPlaylist>(
      `/api/v1/admin/playlist/${playlistId}/device-groups`,
      deviceGroupIds
    );
  }

  public removeDeviceGroups(
    playlistId: number,
    deviceGroupIds: number[]
  ): Observable<BaseOutputString> {
    return this.http.put<BaseOutputString>(
      `/api/v1/admin/playlist/remove/${playlistId}/device-groups`,
      deviceGroupIds
    );
  }

  public assignFileByCategoryIds(
    playlistId: number,
    categoryIds: number[]
  ): Observable<BaseOutputPlaylist> {
    return this.http.put<BaseOutputPlaylist>(
      `/api/v1/admin/playlist/${playlistId}/categories`,
      categoryIds
    );
  }

  public moveFileByFileId(
    id: number,
    fileId: number,
    idUp: boolean
  ): Observable<BaseOutputPlaylist> {
    return this.http.put<BaseOutputPlaylist>(
      `/api/v1/admin/playlist/move-file/${id}/${fileId}`,
      {},
      { params: { idUp } }
    );
  }

  public refreshFileOrderById(
    playlistId: number
  ): Observable<BaseOutputPlaylist> {
    return this.http.put<BaseOutputPlaylist>(
      `/api/v1/admin/playlist/file-order/${playlistId}`,
      {}
    );
  }
}
