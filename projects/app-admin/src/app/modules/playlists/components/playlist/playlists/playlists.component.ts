import { Component, OnInit, ViewChild } from '@angular/core';
import { LhTableComponent } from '../../../../../../../../app-common/src/lib/components/lh-table/lh-table.component';
import {
  LhTableConfigModel,
  LhTableFieldType,
} from '../../../../../../../../app-common/src/lib/components/lh-table/lh-table-config.model';
import { PlaylistAddComponent } from '../playlist-add/playlist-add.component';
import { Playlist } from '../../../../../../../../app-api/src/lib/api/models/playlist';
import { AdminPlaylistService } from '../../../../../../../../app-api/src/lib/modules/admin/admin-playlist/admin-playlist.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';
import { Schedule } from '../../../../../../../../app-api/src/lib/api/models/schedule';
import { ResponseStatus } from '../../../../../../../../app-api/src/lib/api/models/responseStatus';
import { TranslateService } from '@ngx-translate/core';

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
  tableConfig: LhTableConfigModel = {
    disableDetail: true,
    key: 'id',
    fields: [
      {
        label: 'module.playlist.name',
        field: 'name',
        type: LhTableFieldType.STRING,
      },
      {
        label: 'module.playlist.description',
        field: 'description',
        type: LhTableFieldType.STRING,
      },
    ],
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private playlistService: AdminPlaylistService,
    private message: NzMessageService,
    private router: Router,
    private translateService: TranslateService
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
    this.playlistService.delete(playList?.id as number).subscribe({
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
