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
    adding: boolean;
    searching: boolean;
    device: boolean;
  } = {
    adding: false,
    searching: false,
    device: false,
  };
  deviceGroups: DeviceGroup[] = [];
  files: Array<DsdFile> = [];

  totalDeviceGroup: number = 0;
  pageIndexDeviceGroup: number = 1;
  pageSizeDeviceGroup: number = 10;
  totalFile: number = 0;
  pageIndexFile: number = 1;
  pageSizeFile: number = 10;

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
      name: 'module.file.name',
      key: 'name',
    },
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private adminPlayListService: AdminPlaylistService,
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
          },
          error: (err) => {
            this.message.error('Error', err);
          },
          complete: () => {},
        });
    }
  }

  getFileByPlayListId(): void {
    if (this.playlist) {
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
          },
          error: (err) => {
            this.message.error('Error', err);
          },
          complete: () => {},
        });
    }
  }

  onQueryParamsChangeDeviceGroups(params: NzTableQueryParams) {
    console.log('params:', params);
    const { pageIndex, pageSize, sort, filter } = params;
    const { key, value } = sort?.find((s) => s.value) || {};
  }

  onQueryParamsChangeFiles(params: NzTableQueryParams) {
    console.log('params:', params);
    const { pageIndex, pageSize, sort, filter } = params;
    const { key, value } = sort?.find((s) => s.value) || {};
  }
}
