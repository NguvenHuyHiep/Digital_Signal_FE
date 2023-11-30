import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
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
import { AdminPlayListAPIService } from '@app-api/lib/api';

@Injectable({
  providedIn: 'root',
})
export class AdminPlaylistService {
  constructor(
    private formBuilder: FormBuilder,
    private adminPlayListController: AdminPlayListAPIService
  ) {}

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

  deleteChapter() {}

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

  public getAllPlayList(
    page?: number,
    size?: number,
    sortBy?: string,
    sortDirection?: string,
    keyword?: string
  ) {
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
    return this.adminPlayListController
      .getByPaging4(0, 100, 'id', 'DESC')
      .pipe(tap((response) => console.log(response)));
  }

  public addPlayList(playList: Playlist): Observable<BaseOutputPlaylist> {
    return this.adminPlayListController.create3(playList);
  }

  public updatePlayList(playList: Playlist): Observable<BaseOutputPlaylist> {
    return this.adminPlayListController.update3(
      playList.id as number,
      playList
    );
  }

  public delete(playList: number): Observable<BaseOutputString> {
    return this.adminPlayListController.delete3(playList);
  }

  public getPlaylistWithFile(id: number): Observable<BaseOutputPlaylist> {
    return this.adminPlayListController.getByIdWithFiles(id);
  }
  public getDeviceGroupByPlayListId(
    id: number
  ): Observable<BaseOutputPlaylist> {
    return this.adminPlayListController.getByIdWithFilesDeviceGroups(id);
  }

  public assignFile(playListId: number, fileIds: number[]) {
    return this.adminPlayListController.assignFiles(playListId, fileIds);
  }

  public getPlaylistByPlaylistId(playlistId: number) {
    return this.adminPlayListController.getById3(playlistId);
  }

  public assignDeviceGroups(playlistId: number, deviceGroupIds: number[]) {
    return this.adminPlayListController.assignDeviceGroups(
      playlistId,
      deviceGroupIds
    );
  }
}
