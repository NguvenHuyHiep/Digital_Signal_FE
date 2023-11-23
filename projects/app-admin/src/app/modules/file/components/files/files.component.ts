import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { LhTableComponent } from '../../../../../../../app-common/src/lib/components/lh-table/lh-table.component';
import { FileAddComponent } from '../file-add/file-add.component';
import {
  LhTableConfigModel,
  LhTableFieldType,
} from '../../../../../../../app-common/src/lib/components/lh-table/lh-table-config.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AdminFileService } from '../../../../../../../app-api/src/lib/modules/admin/admin-file/admin-file.service';
import { DsdFile } from '../../../../../../../app-api/src/lib/api/models/dsdFile';
import { Playlist } from '../../../../../../../app-api/src/lib/api/models/playlist';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { AdminPlaylistService } from '../../../../../../../app-api/src/lib/modules/admin/admin-playlist/admin-playlist.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Schedule } from '../../../../../../../app-api/src/lib/api/models/schedule';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ResponseStatus } from 'projects/app-api/src/lib/api/models/responseStatus';

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
  query: {
    action?: string;
    id?: string;
  } = {
    action: undefined,
    id: undefined,
  };
  isSelectedRow(): boolean {
    return (this.table?.setOfCheckedId?.size || 0) > 0;
  }

  constructor(
    private activedRoute: ActivatedRoute,
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
      nzTitle: `Do you want to delete the file: ${file.path} ?`,
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
      relativeTo: this.activedRoute,
    });
  };

  navigateToCreate = (): void => {
    this.router.navigate(['./create'], {
      relativeTo: this.activedRoute,
    });
  };
}
