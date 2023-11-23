import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DsdFile } from '../../../../../../../app-api/src/lib/api/models/dsdFile';
import {
  LhTableConfigModel,
  LhTableFieldType,
} from '../../../../../../../app-common/src/lib/components/lh-table/lh-table-config.model';
import { AdminFileService } from '../../../../../../../app-api/src/lib/modules/admin/admin-file/admin-file.service';
import { AdminPlaylistService } from '../../../../../../../app-api/src/lib/modules/admin/admin-playlist/admin-playlist.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Playlist } from '../../../../../../../app-api/src/lib/api/models/playlist';
import { ResponseStatus } from '../../../../../../../app-api/src/lib/api/models/responseStatus';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../../../../../../app-api/src/lib/api/models/user';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-file-detail',
  templateUrl: './files-by-playlist.component.html',
  styleUrls: ['./files-by-playlist.component.scss'],
})
export class FilesByPlaylist<T extends Object> implements OnInit {
  @Input() currentPlayList?: Playlist;
  @Output() onGroup: EventEmitter<T> = new EventEmitter<T>();
  files: Array<DsdFile> = [];
  currentFile?: DsdFile;
  tableConfig: LhTableConfigModel = {
    disableDetail: true,
    disableUpdate: true,
    disableDelete: true,
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

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private adminFileService: AdminFileService,
    private adminPlaylistService: AdminPlaylistService,
    private message: NzMessageService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.loading.searching = true;
    if (this.currentPlayList?.id) {
      this.adminPlaylistService
        .getPlaylistWithFile(this.currentPlayList?.id as number)
        .subscribe({
          next: (response) => {
            if (response && response.status === ResponseStatus.Success) {
              this.files = response.data?.files as DsdFile[];
            } else {
              let errorsInStr: string = response.errors
                ?.map((e) => this.translateService.instant(e))
                .join(', ') as string;
              this.message.error(errorsInStr);
            }
          },
          error: (err) => {
            //TODO Xử lý exception
          },
          complete: () => {
            this.loading.searching = false;
          },
        });
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
      });
    }
  }

  update(files: DsdFile) {
    this.currentFile = files as DsdFile;
    this.showFrame.add = true;
    this.showFrame.search = false;
  }

  delete($event: DsdFile) {}

  navigateToUpdate = (record: DsdFile): void => {
    console.log(record);
    this.currentFile = record;
    this.router.navigate(['./update', record.id], {
      relativeTo: this.activatedRoute,
    });
  };
}
