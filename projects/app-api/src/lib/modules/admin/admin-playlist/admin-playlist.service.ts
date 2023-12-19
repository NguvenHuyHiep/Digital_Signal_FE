import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Playlist } from '@app-api/lib/api/models/playlist';
import { DsdFile } from '@app-api/lib/api/models/dsdFile';
import {
  FormGroupFile,
  FormGroupPlayList,
} from '@app-admin/app/modules/playlists/components/playlist';
import { PlaylistStatus } from '@app-api/lib/api/models/playlistStatus';
import { BaseOutputPlaylist } from '@app-api/lib/api/models/baseOutputPlaylist';
import { BaseOutputString } from '@app-api/lib/api/models/baseOutputString';
import { AdminPlaylistApiService } from '@app-api/lib/api/apis/admin/admin-playlist.api.service';

@Injectable({
  providedIn: 'root',
})
export class AdminPlaylistService {
  constructor(
    private formBuilder: FormBuilder,
    private adminPlayListController: AdminPlaylistApiService
  ) {}

  public getPlaylistByPaging(
    page?: number,
    size?: number,
    sortBy?: string,
    sortDirection?: string,
    keyword?: string
  ) {
    return this.adminPlayListController
      .getByPaging(
        page ?? 0,
        size ?? 100,
        sortBy ?? 'id',
        sortDirection ?? 'DESC',
        keyword ?? ''
      )
      .pipe(tap((response) => console.log(response)));
  }

  public buildPlaylistForm(
    playlist?: Playlist,
    file?: DsdFile
  ): FormGroupPlayList {
    let form = this.formBuilder.group({
      id: [playlist?.id],
      name: [playlist?.name || ''],
      description: [playlist?.description || ''],
      startTime: [
        playlist?.startTime ? new Date(playlist.startTime) : new Date(),
      ],
      endTime: [playlist?.endTime ? new Date(playlist.endTime) : new Date()],
      isLoop: [playlist?.isLoop || ''],
      status: [playlist?.status || PlaylistStatus.Active],
    }) as unknown as FormGroupPlayList;
    form.addControl('files', this.formBuilder.array([]) as FormArray);
    playlist?.files?.forEach((file) => {
      const fileForm: FormGroupFile = this.buildFileForm(file);
      form.controls.files?.push(fileForm);
    });
    return form;
  }

  public buildFileForm(file?: DsdFile, playlist?: Playlist): FormGroupFile {
    let form = this.formBuilder.group({
      id: [file?.id || ''],
      name: [file?.name, [Validators.maxLength(200)]],
      fileType: [file?.fileType],
      path: [file?.path],
      playlist: [playlist?.id || ''],
    }) as unknown as FormGroupFile;
    return form;
  }

  public getPlaylistByPlaylistId(playlistId: number) {
    return this.adminPlayListController.getById(playlistId);
  }

  public getAllPlayList(
    page?: number,
    size?: number,
    sortBy?: string,
    sortDirection?: string,
    keyword?: string
  ) {
    return this.adminPlayListController
      .getByPaging(
        page ?? 0,
        size ?? 100,
        sortBy ?? 'id',
        sortDirection ?? 'desc',
        keyword ?? ''
      )
      .pipe(tap((response) => console.log(response)));
  }

  public addPlayList(playList: Playlist): Observable<BaseOutputPlaylist> {
    return this.adminPlayListController.create(playList);
  }

  public updatePlayList(playList: Playlist): Observable<BaseOutputPlaylist> {
    return this.adminPlayListController.update(playList.id as number, playList);
  }

  public delete(playList: number): Observable<BaseOutputString> {
    return this.adminPlayListController.delete(playList);
  }

  public deletePlaylistByIds(ids: number[]): Observable<BaseOutputString> {
    return this.adminPlayListController.deleteByIds(ids);
  }

  public updatePlaylistStatus(
    id: number,
    status: PlaylistStatus
  ): Observable<BaseOutputPlaylist> {
    return this.adminPlayListController.updateStatus(id, status);
  }

  public getPlaylistWithFile(id: number): Observable<BaseOutputPlaylist> {
    return this.adminPlayListController.getWithFiles(id);
  }

  public assignFile(
    playListId: number,
    fileIds: number[]
  ): Observable<BaseOutputPlaylist> {
    return this.adminPlayListController.assignFiles(playListId, fileIds);
  }

  public removeFiles(playListId: number, fileIds: number[]) {
    return this.adminPlayListController.removeFiles(playListId, fileIds);
  }

  public getDeviceGroupByPlayListId(
    id: number
  ): Observable<BaseOutputPlaylist> {
    return this.adminPlayListController.getWithDeviceGroups(id);
  }

  public assignDeviceGroups(
    playlistId: number,
    deviceGroupIds: number[]
  ): Observable<BaseOutputPlaylist> {
    return this.adminPlayListController.assignDeviceGroups(
      playlistId,
      deviceGroupIds
    );
  }

  public removeDeviceGroups(playlistId: number, deviceGroupIds: number[]) {
    return this.adminPlayListController.removeDeviceGroups(
      playlistId,
      deviceGroupIds
    );
  }
}
