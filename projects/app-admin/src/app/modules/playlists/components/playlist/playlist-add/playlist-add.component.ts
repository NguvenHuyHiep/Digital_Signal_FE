import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { Observable } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { AdminDeviceGroupService } from '@app-api/lib/modules/admin/group-device/admin-group-device.service';
import { ResponseStatus } from '@app-api/lib/api/models/responseStatus';
import { Playlist } from '@app-api/lib/api/models/playlist';
import { DsdFile } from '@app-api/lib/api/models/dsdFile';
import {
  LhTableConfigModel,
  LhTableFieldType,
} from '@app-common/lib/components/lh-table/lh-table-config.model';
import { AdminPlaylistService } from '@app-api/lib/modules/admin/admin-playlist/admin-playlist.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BaseOutputPlaylist } from '@app-api/lib/api/models/baseOutputPlaylist';
import { DeviceGroup } from '@app-api/lib/api/models/deviceGroup';
import {
  FormGroupFile,
  FormGroupPlayList,
} from '@app-admin/app/modules/playlists/components/playlist';
import { FormDeviceGroup } from '@app-admin/app/modules/device-group/components/form-device-group';
import { AdminFileService } from '@app-api/lib/modules/admin/admin-file/admin-file.service';
import { PlaylistStatus } from '@app-api/lib/api/models/playlistStatus';
import { ColumnItem } from '@app-api/lib/api/models/columnItem';

@Component({
  selector: 'app-admin-playlist-add',
  templateUrl: './playlist-add.component.html',
  styleUrls: ['./playlist-add.component.scss'],
})
export class PlaylistAddComponent implements OnInit {
  @Input('fileIds') fileIds?: number;
  @Input('playlistId') currentPlaylist?: Playlist;
  playlistId: number | undefined;

  files: Array<DsdFile> = [];
  deviceGroups: DeviceGroup[] = [];

  currentFile: DsdFile = {};
  currentDeviceGroup: DeviceGroup = {};
  isVisible: boolean = false;

  deviceGroupTableColumns: ColumnItem<DeviceGroup>[] = [
    {
      name: 'ID',
      key: 'id',
    },
    {
      name: 'module.groupDevice.name',
      key: 'path',
    },
    {
      name: 'module.groupDevice.description',
      key: 'createDate',
    },
  ];

  fileTableColumns: ColumnItem<DsdFile>[] = [
    {
      name: 'ID',
      key: 'id',
    },
    {
      name: 'module.file.name',
      key: 'path',
    },
    {
      name: 'module.file.contentType',
      key: 'fileType',
    },
    {
      name: 'module.device.update-date',
      key: 'createDate',
    },
  ];

  form: FormGroupPlayList = this.adminPlaylistService.buildPlaylistForm(
    this.currentPlaylist
  );

  addFileForm: FormGroupFile = this.formBuilder.group({
    fileId: ['', Validators.required],
  }) as unknown as FormGroupFile;
  addDeviceGroupForm: FormDeviceGroup = this.formBuilder.group({
    deviceGroupId: ['', Validators.required],
  }) as unknown as FormDeviceGroup;

  isChecked: boolean = false;

  loading: {
    addDeviceGroup: boolean;
    searching: boolean;
    addFile: boolean;
    adding: boolean;
  } = {
    addDeviceGroup: false,
    addFile: false,
    searching: false,
    adding: false,
  };

  tableConfig: LhTableConfigModel = {
    disableDetail: true,
    disableUpdate: true,
    key: 'id',
    fields: [
      {
        label: 'module.file.name',
        field: 'name',
        type: LhTableFieldType.STRING,
      },
    ],
  };
  tableConfigDeviceGroup: LhTableConfigModel = {
    disableDetail: true,
    disableUpdate: true,
    key: 'id',
    fields: [
      {
        label: 'module.groupDevice.name',
        field: 'name',
        type: LhTableFieldType.STRING,
      },
    ],
  };

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private translateService: TranslateService,
    private formBuilder: FormBuilder,
    private adminPlaylistService: AdminPlaylistService,
    private adminFileService: AdminFileService,
    private message: NzMessageService,
    private modalService: NzModalService,
    private adminDeviceGroupService: AdminDeviceGroupService
  ) {
    this.playlistId = this.activatedRoute.snapshot.params['playlistId'];
  }

  ngOnInit(): void {
    if (this.playlistId) {
      this.loadDeviceGroupByPlayListId(this.playlistId);
      this.getPlaylistById(this.playlistId);
      this.loadFileByPlayListId(this.playlistId);
    }
  }

  public add() {
    if (!this.form) {
      return;
    }
    this.loading.adding = true;
    this.addOrUpdate().subscribe({
      next: (response) => {
        if (response.data) {
          this.currentPlaylist = response.data;
        }
      },
      error: (err) => {
        // TODO i18n
        this.message.error('Error', err);
        this.loading.searching = false;
      },
      complete: () => {
        this.loading.adding = false;
        this.location.back();
      },
    });
  }

  public addOrUpdate(): Observable<BaseOutputPlaylist> {
    if (!this.form.valid) {
      this.form.markAsTouched();
      this.form.markAsDirty();
    }
    if (!this.form.controls.id?.value) {
      let addObj: Playlist = {
        name: this.form.controls.name?.value,
        description: this.form.controls.description?.value,
        startTime:
          this.form.controls.startTime?.value instanceof Date
            ? this.form.controls.startTime?.value?.toISOString()
            : this.form.controls.startTime?.value,
        endTime:
          this.form.controls.endTime?.value instanceof Date
            ? this.form.controls.endTime?.value?.toISOString()
            : this.form.controls.endTime?.value,
        isLoop: this.form.controls.isLoop?.value,
        status: this.form.controls.status?.value || PlaylistStatus.Inactive,
        files: this.form.controls.files?.value as Array<DsdFile>,
      };
      return this.adminPlaylistService.addPlayList(addObj);
    }
    let addObj: Playlist = {
      id: Number(this.form.controls.id?.value),
      name: this.form.controls.name?.value,
      description: this.form.controls.description?.value,
      startTime:
        this.form.controls.startTime?.value instanceof Date
          ? this.form.controls.startTime?.value?.toISOString()
          : this.form.controls.startTime?.value,
      endTime:
        this.form.controls.endTime?.value instanceof Date
          ? this.form.controls.endTime?.value?.toISOString()
          : this.form.controls.endTime?.value,
      isLoop: this.form.controls.isLoop?.value,
      status: this.form.controls.status?.value || PlaylistStatus.Inactive,
      files: this.form.controls.files?.value as Array<DsdFile>,
    };
    return this.adminPlaylistService.updatePlayList(addObj);
  }

  setCurrentFile($event: DsdFile) {
    this.currentFile = $event;
    console.log('this.currentFile', this.currentFile);
  }

  addFile() {
    if (!this.addFileForm) {
      return;
    }
    const FileIdValue = Number(this.currentFile.id);
    this.loading.addFile = true;
    this.adminPlaylistService
      .assignFile(this.currentPlaylist?.id as number, [FileIdValue])
      .subscribe({
        next: (response) => {
          if (response && response.status === ResponseStatus.Success) {
            this.loadFileByPlayListId(this.playlistId as number);
            return;
          } else {
            let errorsInStr: string = response.errors
              ?.map((e) => this.translateService.instant(e))
              .join(', ') as string;
            this.message.error(errorsInStr);
          }
        },
        error: (err) => {
          // TODO i18n
          this.message.error('Error', err);
          this.loading.addFile = false;
        },
        complete: () => {
          this.loading.addFile = false;
        },
      });
  }

  getPlaylistById(playlistId: number) {
    this.loading.searching = true;
    this.adminPlaylistService.getPlaylistByPlaylistId(playlistId).subscribe({
      next: (response) => {
        if (response && response.status === ResponseStatus.Success) {
          this.currentPlaylist = response.data;
          this.form.patchValue(this.currentPlaylist as any);
        } else {
          let errorsInStr: string = response.errors
            ?.map((e) => this.translateService.instant(e))
            .join(', ') as string;
          this.message.error(errorsInStr);
        }
      },
      error: (err) => {
        this.loading.searching = false;
        this.message.error('Error', err);
      },
      complete: () => {
        this.loading.searching = false;
      },
    });
  }

  navigateToPrevious() {
    this.location.back();
  }

  setCurrentDeviceGroup($event: DeviceGroup) {
    this.currentDeviceGroup = $event;
    console.log('this.currentDeviceGroup', this.currentDeviceGroup);
  }

  addDeviceGroup() {
    if (!this.addDeviceGroupForm) {
      return;
    }
    const DeviceGroupIdValue = Number(this.currentDeviceGroup.id);
    this.loading.addDeviceGroup = true;
    this.adminPlaylistService
      .assignDeviceGroups(this.playlistId as number, [DeviceGroupIdValue])
      .subscribe({
        next: (response) => {
          if (response && response.status === ResponseStatus.Success) {
            this.deviceGroups = response.data?.deviceGroups as DeviceGroup[];
          } else {
            let errorsInStr: string = response.errors
              ?.map((e) => this.translateService.instant(e))
              .join(', ') as string;
            this.message.error(errorsInStr);
          }
        },
        error: (err) => {
          this.message.error('Error', err);
          this.loading.addDeviceGroup = false;
        },
        complete: () => {
          this.loading.addDeviceGroup = false;
        },
      });
  }

  private loadFileByPlayListId(playlistId: number) {
    this.loading.addFile = true;
    console.log('playlistAdmin', this.currentPlaylist);
    if (this.playlistId) {
      this.adminPlaylistService.getPlaylistWithFile(playlistId).subscribe({
        next: (response) => {
          if (response && response.status === ResponseStatus.Success) {
            this.files = response.data?.files as DsdFile[];
            console.log(this.files + 'files');
          } else {
            let errorsInStr: string = response.errors
              ?.map((e) => this.translateService.instant(e))
              .join(', ') as string;
            this.message.error(errorsInStr);
          }
        },
        error: (err) => {
          this.message.error('Error', err);
          this.loading.addFile = false;
        },
        complete: () => {
          this.loading.addFile = false;
        },
      });
    }
  }

  private loadDeviceGroupByPlayListId(playlistId: number) {
    this.loading.addDeviceGroup = true;
    if (this.playlistId) {
      this.adminPlaylistService
        .getDeviceGroupByPlayListId(playlistId)
        .subscribe({
          next: (response) => {
            if (response && response.status === ResponseStatus.Success) {
              this.deviceGroups = response.data?.deviceGroups as DeviceGroup[];
            } else {
              let errorsInStr: string = response.errors
                ?.map((e) => this.translateService.instant(e))
                .join(', ') as string;
              this.message.error(errorsInStr);
            }
          },
          error: (err) => {
            this.message.error('Error', err);
            this.loading.addDeviceGroup = false;
          },
          complete: () => {
            this.loading.addDeviceGroup = false;
          },
        });
    }
  }

  removeFileFromPlaylist(file: DsdFile) {
    this.loading.addFile = true;
    this.modalService.confirm({
      nzTitle:
        this.translateService.instant('module.playlist.modalRemoveFile') +
        `${file.name}` +
        ' ?',
      nzOnOk: () => {
        new Promise((resolve, reject) => {
          const fileId: number = file.id as number;
          return this.adminFileService
            .removeFilesFromPlaylist(this.currentPlaylist?.id as number, [
              fileId,
            ])
            .subscribe({
              next: (response) => {
                if (response && response.status === ResponseStatus.Success) {
                  this.files = this.files.filter((f) => f.id !== fileId);
                }
              },
              error: (err) => {
                this.message.create(err, 'error');
                this.loading.addFile = false;
              },
              complete: () => {
                this.loading.addFile = false;
              },
            });
        }).catch((err) => {
          console.log(err);
          this.loading.addFile = false;
        });
      },
    });
  }

  removeDeviceGroupFromPlaylist(deviceGroup: DeviceGroup) {
    this.loading.addDeviceGroup = true;
    this.modalService.confirm({
      nzTitle:
        this.translateService.instant(
          'module.groupDevice.modalRemoveDeviceGroup'
        ) +
        `${deviceGroup.name}` +
        ' ?',
      nzOnOk: () => {
        new Promise((resolve, reject) => {
          const deviceGroupId = Number(deviceGroup.id);
          return this.adminPlaylistService
            .removeDeviceGroups(this.currentPlaylist?.id as number, [
              deviceGroupId,
            ])
            .subscribe({
              next: (response) => {
                if (response && response.status === ResponseStatus.Success) {
                  this.deviceGroups = this.deviceGroups.filter(
                    (dg) => dg.id !== deviceGroupId
                  );
                }
              },
              error: (err) => {
                this.message.error('Error', err);
                this.loading.addDeviceGroup = false;
              },
              complete: () => {
                this.loading.addDeviceGroup = false;
              },
            });
        }).catch((err) => {
          console.log(err);
          this.loading.addDeviceGroup = false;
        });
      },
    });
  }

  getMimeTypeName(fileType: string | any) {
    if (fileType.startsWith('video')) {
      return 'Video';
    } else if (fileType.startsWith('image')) {
      return 'Image';
    } else {
      return 'Other';
    }
  }
}
