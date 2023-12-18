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

  tableColumns: ColumnItem<Playlist>[] = [
    {
      name: 'module.playlist.name',
      sortOrder: 'descend',
      sortFn: (a: Playlist, b: Playlist) =>
        a.name?.localeCompare(b.name as string) as number,
      listOfFilter: [],
      filterFn: null,
      filterMultiple: false,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'module.playlist.description',
      sortOrder: 'descend',
      sortFn: (a: Playlist, b: Playlist) =>
        a.description?.localeCompare(b.description as string) as number,
      listOfFilter: [],
      filterFn: null,
      filterMultiple: false,
      sortDirections: ['ascend', 'descend', null],
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
    this.getAllPlaylist();
  }

  get isSelectedRow(): boolean {
    return (this.table?.setOfCheckedId?.size || 0) > 0;
  }

  getAllPlaylist(): void {
    this.loading.searching = true;
    this.playlistService.getAllPlayList(0, 100).subscribe({
      next: (response) => {
        if (response && response.status === ResponseStatus.Success) {
          this.playlists = response.data as Playlist[];
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
              this.getAllPlaylist();
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
