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
import { LhAuthenService } from '../../../../../../../../app-api/src/lib/modules/authen/lh-authen.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-playlist',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss'],
})
export class PlaylistsComponent implements OnInit {
  currentPlaylist?: Playlist;
  playlists: Array<Playlist> = [];
  showFrame: {
    search: boolean;
    add: boolean;
  } = {
    search: true,
    add: false,
  };
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
      {
        label: 'module.playlist.startTime',
        field: 'startTime',
        type: LhTableFieldType.DATE_TIME,
      },
      {
        label: 'module.playlist.endTime',
        field: 'endTime',
        type: LhTableFieldType.DATE_TIME,
      },
    ],
  };

  constructor(
    private playlistService: AdminPlaylistService,
    private message: NzMessageService,
    private authenService: LhAuthenService,
    private router: Router
  ) {
    this.authenService.userObs.subscribe(
      (playList) => (this.currentPlaylist = playList)
    );
  }

  get isSelectedRow(): boolean {
    return (this.table?.setOfCheckedId?.size || 0) > 0;
  }

  ngOnInit(): void {
    this.getAllPlaylist();
  }

  getAllPlaylist(): void {
    this.loading.searching = true;
    this.playlistService.getAllPlayList(0, 100).subscribe({
      next: (response) => {
        if (response.data) {
          this.playlists = response.data as Array<Playlist>;
          console.log(this.playlists + 'playlist');
        }
      },
      error: (err) => {
        // TODO i18n
        this.message.error('Error', err);
        this.loading.searching = false;
      },
      complete: () => {
        this.loading.searching = false;
      },
    });
  }

  add() {
    if (!this.addComponent) {
      return;
    }
    this.loading.adding = true;
    this.addComponent.addOrUpdate().subscribe({
      next: (response) => {
        if (response.data) {
          this.currentPlaylist = response.data;
          this.getAllPlaylist();
          this.showFrame.search = true;
          this.showFrame.add = false;
        }
      },
      error: (err) => {
        // TODO i18n
        this.message.error('Error', err);
        this.loading.searching = false;
      },
      complete: () => {
        this.loading.adding = false;
      },
    });
  }

  gotoSearch() {
    this.showFrame.search = true;
    this.showFrame.add = false;
  }

  deleteSelected() {}

  update(playlist: Playlist) {
    this.currentPlaylist = playlist;
    this.showFrame.add = true;
    this.showFrame.search = false;
  }

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
  routeToAdd() {
    const queryParams = { action: 'add' };
    this.router.navigate([], { queryParams }).then((r) => {});
  }
}
