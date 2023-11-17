import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DsdFile} from "../../../../../../../app-api/src/lib/api/models/dsdFile";
import {
  LhTableConfigModel,
  LhTableFieldType
} from "../../../../../../../app-common/src/lib/components/lh-table/lh-table-config.model";
import {AdminFileService} from "../../../../../../../app-api/src/lib/modules/admin/admin-file/admin-file.service";
import {
  AdminPlaylistService
} from "../../../../../../../app-api/src/lib/modules/admin/admin-playlist/admin-playlist.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {Playlist} from "../../../../../../../app-api/src/lib/api/models/playlist";

@Component({
  selector: 'app-admin-file-detail',
  templateUrl: './file-detail.component.html',
  styleUrls: ['./file-detail.component.scss']
})
export class FileDetailComponent<T extends Object> implements OnInit {
  @Input() currentPlayList?: Playlist;
  @Output() onGroup: EventEmitter<T> = new EventEmitter<T>();
  files: Array<DsdFile> = [];
  currentFile?: DsdFile;
  tableConfig: LhTableConfigModel = {
    disableDetail: true,
    key: 'id',
    fields: [
      {
        label: 'module.file.name',
        field: 'name',
        type: LhTableFieldType.STRING,
      },
    ],
  };
  loading: {
    adding: boolean;
    searching: boolean;
  } = {
    adding: false,
    searching: false,
  };
  showFrame: {
    search: boolean;
    add: boolean;
  } = {
    search: true,
    add: false,
  };

  constructor(private adminFileService: AdminFileService,
              private adminPlaylistService: AdminPlaylistService
    , private message: NzMessageService
  ) {
  }

  ngOnInit(): void {
    this.loading.searching = true;
    if (this.currentPlayList) {
      this.adminPlaylistService.getPlaylistWithFile(this.currentPlayList?.id as number).subscribe({
        next: (response) => {
          if (response.data) {
            this.files = response.data.files as Array<DsdFile>
          }
        },
        error: err => {
          //TODO Xử lý exception
        }
        , complete: () => {
          this.loading.searching = false;
        }
      })
    } else {
      this.adminFileService.getAllFile().subscribe({
        next: (response) => {
          if (response && response.data) {
            this.files = response.data;
          }
        },
        error: (err) => {
          //TODO Xử lý exception
        },
        complete: () => {
          this.loading.searching = false;
        },
      });}
  }

  update(files: DsdFile) {
    this.currentFile = files as DsdFile;
    this.showFrame.add = true;
    this.showFrame.search = false;
  }

  delete($event: DsdFile) {

  }


}
