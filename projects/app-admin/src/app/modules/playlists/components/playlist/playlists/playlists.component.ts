import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Playlist } from '@app-api/lib/api/models/playlist';
import { LhTableComponent } from '@app-common/lib/components/lh-table/lh-table.component';
import { AdminPlaylistService } from '@app-api/lib/modules/admin/admin-playlist/admin-playlist.service';
import { ResponseStatus } from '@app-api/lib/api/models/responseStatus';
import { Schedule } from '@app-api/lib/api/models/schedule';
import { PlaylistAddComponent } from '@app-admin/app/modules/playlists/components/playlist/playlist-add/playlist-add.component';
import { ColumnItem } from '@app-api/lib/api/models/columnItem';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-admin-playlist',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss'],
})
export class PlaylistsComponent implements OnInit {
  currentPlaylist?: Playlist;
  playlists: Array<Playlist> = [];
  @ViewChild('table') table?: LhTableComponent<Playlist>;
  @ViewChild('addComponent', { static: false })
  addComponent?: PlaylistAddComponent;
  loading: {
    adding: boolean;
    searching: boolean;
  } = {
    adding: false,
    searching: false,
  };

  // paging variables
  total: number = 0;
  pageIndex: number = 1;
  pageSize: number = 10;

  tableColumns: ColumnItem<Playlist>[] = [
    {
      name: 'module.playlist.name',
      key: 'name',
    },
    {
      name: 'module.playlist.description',
      key: 'description',
    },
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private playlistService: AdminPlaylistService,
    private message: NzMessageService,
    private router: Router,
    private translateService: TranslateService,
    private modalService: NzModalService
  ) {}

  ngOnInit(): void {
    this.getPlaylistByPaging(this.pageIndex - 1, this.pageSize);
  }

  getPlaylistByPaging(
    pageIndex?: number,
    pageSize?: number,
    sortBy?: string,
    sortDirection?: string,
    keyword?: string
  ): void {
    this.loading.searching = true;
    this.playlistService
      .getPlaylistByPaging(
        pageIndex || 0,
        pageSize || 10,
        sortBy || 'id',
        sortDirection || 'desc',
        keyword || ''
      )
      .subscribe({
        next: (response) => {
          if (response && response.status === ResponseStatus.Success) {
            this.playlists = response.data as Playlist[];
            this.total = response.total || 0;
          } else {
            let errorsInStr: string = response.errors
              ?.map((e) => this.translateService.instant(e))
              .join(',') as string;
            this.message.error(errorsInStr);
            this.playlists = [];
          }
        },
        error: (err) => {
          this.message.create(
            'error',
            err.message
              ? err.message
              : this.translateService.instant('common.error')
          );
          console.log(err);
        },
        complete: () => {
          this.loading.searching = false;
        },
      });
  }

  onQueryParamsChange(params: NzTableQueryParams) {
    console.log('params:', params);
    const { pageIndex, pageSize, sort, filter } = params;
    const { key, value } = sort?.find((s) => s.value) || {};
    this.getPlaylistByPaging(
      pageIndex - 1,
      pageSize,
      key,
      value?.replace(/end$/, '')
    );
  }
  get isSelectedRow(): boolean {
    return (this.table?.setOfCheckedId?.size || 0) > 0;
  }

  deleteSelected() {}

  navigateToUpdate = (record: Playlist): void => {
    console.log(record);
    this.currentPlaylist = record;
    this.router.navigate(['./update', record.id], {
      relativeTo: this.activatedRoute,
    });
  };

  delete(playList: Playlist) {
    this.modalService.confirm({
      nzTitle:
        this.translateService.instant('module.playlist.modalDeletePlayList') +
        `${playList.name}` +
        ' ?',
      nzOnOk: () => {
        new Promise((resolve, reject) => {
          return this.playlistService.delete(playList?.id as number).subscribe({
            next: (response) => {
              this.getPlaylistByPaging();
            },
            error: (err) => {
              //TODO Xử lý exception
            },
            complete: () => {
              this.loading.searching = false;
            },
          });
        });
      },
    });
  }

  navigateToCreate = (): void => {
    this.router.navigate(['./create'], {
      relativeTo: this.activatedRoute,
    });
  };

  navigateToDetail = (record: Schedule): void => {
    console.log(record);
    this.router.navigate(['./detail', record.id], {
      relativeTo: this.activatedRoute,
    });
  };
}
