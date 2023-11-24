import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FormGroupFile, FormGroupPlayList } from '../../playlist';
import { AdminPlaylistService } from '../../../../../../../../app-api/src/lib/modules/admin/admin-playlist/admin-playlist.service';
import { Playlist } from '../../../../../../../../app-api/src/lib/api/models/playlist';
import { DsdFile } from '../../../../../../../../app-api/src/lib/api/models/dsdFile';
import { BaseOutputPlaylist } from '../../../../../../../../app-api/src/lib/api/models/baseOutputPlaylist';
import { Observable } from 'rxjs';
import {
  LhTableConfigModel,
  LhTableFieldType,
} from '../../../../../../../../app-common/src/lib/components/lh-table/lh-table-config.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AdminFileService } from 'projects/app-api/src/lib/modules/admin/admin-file/admin-file.service';
import { PlaylistStatus } from 'projects/app-api/src/lib/api/models/playlistStatus';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ResponseStatus } from '../../../../../../../../app-api/src/lib/api/models/responseStatus';
import { TranslateService } from '@ngx-translate/core';
import { DeviceGroup } from 'projects/app-api/src/lib/api/models/deviceGroup';
import { AdminDeviceGroupService } from '../../../../../../../../app-api/src/lib/modules/admin/group-device/admin-group-device.service';
import { FormDeviceGroup } from '../../../../device-group/components/form-device-group';

@Component({
  selector: 'app-admin-playlist-add',
  templateUrl: './playlist-add.component.html',
  styleUrls: ['./playlist-add.component.scss'],
})
export class PlaylistAddComponent implements OnInit {
  @Input('fileIds') fileIds?: number;
  @Input() currentPlaylist?: Playlist;
  playlistId: number | undefined;

  files: Array<DsdFile> = [];
  deviceGroups: DeviceGroup[] = [];

  currentFile: DsdFile = {};
  currentDeviceGroup: DeviceGroup = {};
  isVisible: boolean = false;

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
    private fileService: AdminFileService,
    private message: NzMessageService,
    private modalService: NzModalService,
    private adminDeviceGroupService: AdminDeviceGroupService
  ) {
    this.playlistId = this.activatedRoute.snapshot.params['playlistId'];
  }

  ngOnInit(): void {
    this.loadDeviceGroupByPlayListId();
    if (this.playlistId) {
      this.getPlaylistById(this.playlistId);
      this.loadFileByPlayListId();
    } else {
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
        this.message.create('success', 'Thêm mới thành công');
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

  deleteFile(record: DsdFile) {
    console.log(record);
    this.modalService.confirm({
      nzTitle: `Do you want to delete the file: ${record.path} ?`,
      nzOnOk: () => {
        new Promise((resolve, reject) => {
          this.fileService.deleteFile(record.path as string).subscribe({
            next: (response) => {
              console.log(response);
              this.files = this.files.filter((f) => f.path !== record.path);
              resolve;
            },
            error: (err) => {
              this.message.error(err);
              // TODO handle error
              resolve;
            },
            complete: () => {
              resolve;
            },
          });
        }).catch((err) => console.log(err));
      },
    });
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
            this.loadFileByPlayListId();
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
      error: (err) => {},
      complete: () => {
        this.loading.searching = false;
      },
    });
  }

  navigateToPrevious() {
    this.location.back();
  }

  deleteDeviceGroup(deviceGroup: DeviceGroup) {
    this.modalService.confirm({
      nzTitle: `Do you want to delete the device group: ${deviceGroup.name} ?`,
      nzOnOk: () => {
        new Promise((resolve, reject) => {
          return this.adminDeviceGroupService
            .deleteDeviceGroup(deviceGroup?.id as number)
            .subscribe({
              next: (response) => {
                this.loadDeviceGroupByPlayListId();
              },
              error: (err) => {
                this.message.error('Error', err);
              },
              complete: () => {
                this.loading.searching = false;
              },
            });
        });
      },
    });
  }

  setCurrentDeviceGroup($event: DeviceGroup) {
    this.currentDeviceGroup = $event;
    console.log('this.currentFile', this.currentFile);
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

  private loadFileByPlayListId() {
    this.loading.addFile = true;
    console.log('playlistAdmin', this.currentPlaylist);
    if (this.playlistId) {
      this.adminPlaylistService
        .getPlaylistWithFile(this.playlistId as number)
        .subscribe({
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

  private loadDeviceGroupByPlayListId() {
    this.loading.addDeviceGroup = true;
    if (this.playlistId) {
      this.adminPlaylistService
        .getDeviceGroupByPlayListId(this.playlistId as number)
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
}
