import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  LhTableConfigModel,
  LhTableFieldType,
} from '@app-common/lib/components/lh-table/lh-table-config.model';
import { Playlist } from '@app-api/lib/api/models/playlist';
import { LhTableComponent } from '@app-common/lib/components/lh-table/lh-table.component';
import { DsdFile } from '@app-api/lib/api/models/dsdFile';
import { AdminFileService } from '@app-api/lib/modules/admin/admin-file/admin-file.service';
import { AdminPlaylistService } from '@app-api/lib/modules/admin/admin-playlist/admin-playlist.service';
import { Schedule } from '@app-api/lib/api/models/schedule';
import { FileAddComponent } from '@app-admin/app/modules/file/components/file-add/file-add.component';
import { ResponseStatus } from '@app-api/lib/api/models/responseStatus';

@Component({
  selector: 'app-admin-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
})
export class FilesComponent<T extends Object> implements OnInit {
  playListAdmin?: Playlist;
  @Output() onGroup: EventEmitter<T> = new EventEmitter<T>();
  table?: LhTableComponent<DsdFile>;
  addComponent?: FileAddComponent;
  currentFile?: DsdFile;
  fileList: NzUploadFile[] = [];
  files: DsdFile[] = [];
  loading: {
    adding: boolean;
    searching: boolean;
    uploading: boolean;
  } = {
    adding: false,
    searching: false,
    uploading: false,
  };

  tableConfig: LhTableConfigModel = {
    disableUpdate: true,
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

  isSelectedRow(): boolean {
    return (this.table?.setOfCheckedId?.size || 0) > 0;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private translateService: TranslateService,
    private adminFileService: AdminFileService,
    private adminPlaylistService: AdminPlaylistService,
    private message: NzMessageService,
    private modalService: NzModalService
  ) {}

  ngOnInit(): void {
    if (this.playListAdmin) {
      this.getFileById();
    } else {
      this.getAllFile();
    }
  }

  delete(file: DsdFile) {
    this.modalService.confirm({
      nzTitle:
        this.translateService.instant('module.file.modalDeleteFile') +
        `${file.name}` +
        ' ?',
      nzOnOk: () => {
        new Promise((resolve, reject) => {
          return this.adminFileService
            .deleteFile(file.path as string)
            .subscribe({
              next: (response) => {
                console.log(response);
                this.files = this.files.filter((f) => f.path !== file.path);
                resolve;
              },
              error: (err) => {
                this.message.error(err);
                // TODO handle error
                resolve;
              },
              complete: () => {
                resolve;
              },
            });
        }).catch((err) => console.log(err));
      },
    });
  }
  getFileById(): void {
    this.adminPlaylistService
      .getPlaylistWithFile(this.playListAdmin?.id as number)
      .subscribe({
        next: (response) => {
          if (response.data) {
            this.files = response.data.files as DsdFile[];
          }
        },
        error: (err) => {
          //TODO Xử lý exception
          this.message.error('Error', err);
        },
        complete: () => {
          this.loading.searching = false;
        },
      });
  }

  getAllFile(): void {
    this.loading.searching = true;
    this.adminFileService.getAllFile(0, 100).subscribe({
      next: (response) => {
        if (response && response.status === ResponseStatus.Success) {
          this.files = response.data as DsdFile[];
        } else {
          let errorsInStr: string = response.errors
            ?.map((e) => this.translateService.instant(e))
            .join(', ') as string;
          this.message.error(errorsInStr);
          this.files = [];
        }
      },
      error: (err) => {
        // TODO i18n
        this.message.error('Error', err);
        this.files = [];
      },
      complete: () => {
        this.loading.searching = false;
      },
    });
  }

  navigateToDetail = (record: Schedule): void => {
    console.log(record);
    this.router.navigate(['./detail', record.id], {
      relativeTo: this.activatedRoute,
    });
  };

  navigateToCreate = (): void => {
    this.router.navigate(['./create'], {
      relativeTo: this.activatedRoute,
    });
  };
}
