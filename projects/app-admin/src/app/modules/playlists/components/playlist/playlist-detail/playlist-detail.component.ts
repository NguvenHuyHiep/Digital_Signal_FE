import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Playlist } from '@app-api/lib/api/models/playlist';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AdminPlaylistService } from '@app-api/lib/modules/admin/admin-playlist/admin-playlist.service';
import { DeviceGroup } from '@app-api/lib/api/models/deviceGroup';
import {
  LhTableConfigModel,
  LhTableFieldType,
} from '@app-common/lib/components/lh-table/lh-table-config.model';
import { ActivatedRoute, Router } from '@angular/router';
import { LhTableComponent } from '@app-common/lib/components/lh-table/lh-table.component';
import { ResponseStatus } from '@app-api/lib/api/models/responseStatus';
import { TranslateService } from '@ngx-translate/core';
import { DsdFile } from '@app-api/lib/api/models/dsdFile';
import { ColumnItem } from '@app-api/lib/api/models/columnItem';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-admin-playlist-detail',
  templateUrl: './playlist-detail.component.html',
  styleUrls: ['./playlist-detail.component.scss'],
})
export class PlaylistDetailComponent<T extends Object> {
  @ViewChild('table') table?: LhTableComponent<DeviceGroup>;
  @Input('playlist') playlist: Playlist = {};
  @Output() onGroup: EventEmitter<T> = new EventEmitter<T>();

  loading: {
    deviceGroups: boolean;
    files: boolean;
  } = {
    deviceGroups: false,
    files: false,
  };

  deviceGroups: DeviceGroup[] = [];
  files: DsdFile[] = [];

  tableDeviceGroupsColumns: ColumnItem<DeviceGroup>[] = [
    {
      name: 'module.groupDevice.name',
      key: 'name',
    },
    {
      name: 'module.groupDevice.description',
      key: 'description',
    },
  ];

  tableConfigFile: ColumnItem<DsdFile>[] = [
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

  constructor(
    private message: NzMessageService,
    private adminPlaylistService: AdminPlaylistService,
    private translateService: TranslateService
  ) {}
  ngOnInit(): void {
    this.getDeviceGroupByPlayListId();
    this.getFileByPlayListId();
  }

  getDeviceGroupByPlayListId(): void {
    console.log('The device groupId is: ', this.deviceGroups);
    if (this.playlist) {
      this.loading.deviceGroups = true;
      this.adminPlaylistService
        .getDeviceGroupByPlayListId(this.playlist.id as number)
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
            this.loading.deviceGroups = false;
          },
          error: (err) => {
            this.message.error('Error', err);
            this.loading.deviceGroups = false;
          },
          complete: () => {
            this.loading.deviceGroups = false;
          },
        });
    }
  }

  getFileByPlayListId(): void {
    if (this.playlist) {
      this.loading.files = true;
      this.adminPlaylistService
        .getPlaylistWithFile(this.playlist.id as number)
        .subscribe({
          next: (response) => {
            if (response && response.status === ResponseStatus.Success) {
              this.files = response.data?.files as DsdFile[];
              console.log('Files: ', this.files);
            } else {
              let errorsInStr: string = response.errors
                ?.map((e) => this.translateService.instant(e))
                .join(', ') as string;
              this.message.error(errorsInStr);
            }
            this.loading.files = false;
          },
          error: (err) => {
            this.message.error('Error', err);
            this.loading.files = false;
          },
          complete: () => {
            this.loading.files = false;
          },
        });
    }
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
