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
import { ActivatedRoute, Router } from '@angular/router';

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
  query: {
    action?: string;
    id?: string;
  } = {
    action: undefined,
    id: undefined,
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
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.query.action = params['action'];
      this.query.id = params['id'];
      switch (this.query.action) {
        case 'add': {
          this.currentPlaylist = {};
          this.openAddFrame();
          break;
        }
        case 'edit': {
          if (!this.query.id) {
            break;
          }
          if (
            this.currentPlaylist &&
            this.currentPlaylist.id === Number(this.query.id)
          ) {
            break;
          }
          this.playlistService
            .getPlaylistWithFile(Number(this.query.id))
            .subscribe({
              next: (result) => {
                if (result.data) {
                  this.currentPlaylist = result.data;
                  this.openAddFrame();
                }
              },
            });
          break;
        }
        default: {
          this.gotoSearch();
          break;
        }
      }
    });
    this.getAllPlaylist();
  }

  get isSelectedRow(): boolean {
    return (this.table?.setOfCheckedId?.size || 0) > 0;
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
          if (this.query.action === 'add') {
            this.routeToEdit(response.data.id as number);
          }
          if (this.query.action === 'edit') {
            this.gotoSearch();
          }
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
    this.getAllPlaylist();
  }

  deleteSelected() {}

  update(playlist: Playlist) {
    this.currentPlaylist = playlist;
    this.routeToEdit(playlist.id as number);
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

  routerToSearch() {
    this.router.navigate([]).then((r) => {});
  }

  private routeToEdit(id: number) {
    const queryParams = { action: 'edit', id: id };
    this.router.navigate([], { queryParams }).then((r) => {});
  }

  private openAddFrame() {
    this.showFrame.search = false;
    this.showFrame.add = true;
  }
}
