import {Component, OnInit, ViewChild} from '@angular/core';
import {LhTableComponent} from "../../../../../../../../app-common/src/lib/components/lh-table/lh-table.component";
import {
  LhTableConfigModel,
  LhTableFieldType
} from "../../../../../../../../app-common/src/lib/components/lh-table/lh-table-config.model";
import {PlaylistAddComponent} from "../playlist-add/playlist-add.component";
import {Playlist} from "../../../../../../../../app-api/src/lib/api/models/playlist";
import {
  AdminPlaylistService
} from "../../../../../../../../app-api/src/lib/modules/admin/admin-playlist/admin-playlist.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {LhAuthenService} from "../../../../../../../../app-api/src/lib/modules/authen/lh-authen.service";

@Component({
  selector: 'app-admin-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit {
  showFrame: {
    search: boolean,
    add: boolean
  } = {
    search: true,
    add: false
  }
  playList?: Playlist;
  playlists: Array<Playlist> = [];
  @ViewChild('table') table?: LhTableComponent<Playlist>
  @ViewChild('addComponent', {static: false}) addComponent?: PlaylistAddComponent;

  loading: {
    adding: boolean;
    searching: boolean;
  } = {
    adding: false,
    searching: false
  };

  tableConfig: LhTableConfigModel = {
    key: 'id',
    fields: [
      {
        label: 'name'
        , field: 'name'
        , type: LhTableFieldType.STRING
      },
      {
        label: 'description'
        , field: 'description'
        , type: LhTableFieldType.STRING
      },
      {
        label: 'startTime'
        , field: 'startTime'
        , type: LhTableFieldType.DATE_TIME
      },
      {
        label: 'endTime'
        , field: 'endTime'
        , type: LhTableFieldType.DATE_TIME
      }
    ]
  };
  currentPlaylist?: Playlist;

  constructor(private playlistService: AdminPlaylistService
    , private message: NzMessageService
    , private authenService: LhAuthenService
  ) {
    this.authenService.userObs.subscribe(playList => this.playList = playList);
  }

  get isSelectedRow(): boolean {
    return (this.table?.setOfCheckedId?.size || 0) > 0;
  }

  ngOnInit(): void {
    this.getAllPlaylist();
  }

  getAllPlaylist(): void {
    this.loading.searching = true
    this.playlistService.getAllPlayList().subscribe({
      next: (response) => {
        if (response.data) {
          this.playlists = response.data as Array<Playlist>;
          console.log(this.playlists + "playlist");
        }
      }
      , error: err => {
        // TODO i18n
        this.message.error("Error", err);
        this.loading.searching = false;
      }
      , complete: () => {
        this.loading.searching = false;
      }
    });
  }

  add() {
    if (!this.addComponent) {
      return;
    }
    this.loading.adding = true;
    this.addComponent.addOrUpdate().subscribe({
      next: (response) => {
        if(response.data){
          this.gotoSearch();
          this.getAllPlaylist()
        }
      }  , error: err => {
        // TODO i18n
        this.message.error("Error", err);
        this.loading.searching = false;
      }
      , complete: () => {
        this.loading.searching = false;
      }
    })
  }

  gotoSearch() {
    this.showFrame.search = true;
    this.showFrame.add = false;
  }

  openAddFrame() {
    this.currentPlaylist = undefined;
    this.showFrame.search = false;
    this.showFrame.add = true;
  }

  deleteSelected() {

  }

  update(playlist: Playlist) {
    this.currentPlaylist = playlist;
    this.showFrame.add = true;
    this.showFrame.search = false;
  }

  delete() {

  }

  goToSearch() {
    this.showFrame.search = true;
    this.showFrame.add = false;
  }
}
