import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DsdFile } from '@app-api/lib/api/models/dsdFile';
import { ColumnItem } from '@app-api/lib/api/models/columnItem';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TranslateService } from '@ngx-translate/core';
import { AdminFileService } from '@app-api/lib/modules/admin/admin-file/admin-file.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ResponseStatus } from '@app-api/lib/api/models/responseStatus';

@Component({
  selector: 'app-admin-playlist-file-table',
  templateUrl: './playlist-file-table.component.html',
  styleUrls: ['./playlist-file-table.component.scss'],
})
export class PlaylistFileTableComponent implements OnChanges {
  @Input('isShowOption') isShowOption?: boolean = false;
  @Input('playlistId') playlistId?: number = NaN;

  files?: DsdFile[] = [];

  isLoading: boolean = false;
  tableFileColumns: ColumnItem<DsdFile>[] = [
    {
      name: 'ID',
      key: 'id',
    },
    {
      name: 'module.file.name',
      key: 'path',
    },
    {
      name: 'module.file.contentType',
      key: 'fileType',
    },
    {
      name: 'module.device.update-date',
      key: 'createDate',
    },
  ];
  total: number = 0;
  pageIndex: number = 1;
  pageSize: number = 10;

  constructor(
    private fileService: AdminFileService,
    private message: NzMessageService,
    private modalService: NzModalService,
    private translateService: TranslateService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {}

  getFileByPlaylistIdAndPaging(
    playlistId: number,
    pageIndex?: number,
    pageSize?: number,
    sortBy?: string,
    sortDirection?: string
  ) {
    if (playlistId && !isNaN(playlistId)) {
      this.isLoading = true;
      this.fileService
        .getFileByPlaylistIdAndPaging(
          playlistId,
          pageIndex ?? 0,
          pageSize ?? 10,
          sortBy ?? 'id',
          sortDirection ?? 'desc'
        )
        .subscribe({
          next: (response) => {
            if (response && response.data) {
              this.files = response.data;
              this.total = response.total ?? 0;
            }
          },
          error: (err) => {
            this.isLoading = false;
            // TODO i18n
            this.message.error('Error', err);
            this.files = [];
          },
          complete: () => {
            this.isLoading = false;
          },
        });
    }
  }

  onQueryParamsChange(params: NzTableQueryParams) {
    console.log(params);

    const { pageIndex, pageSize, sort, filter } = params;
    const { key, value } = sort?.find((s) => s.value) || {};
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.getFileByPlaylistIdAndPaging(
      this.playlistId as number,
      this.pageIndex - 1,
      this.pageSize,
      key,
      value?.replace(/end$/, '')
    );
  }

  handleRemoveFromPlaylist(selectedFile: DsdFile) {
    this.removeFileFromPlaylist(selectedFile);
  }

  removeFileFromPlaylist(files: DsdFile) {
    this.isLoading = true;
    this.modalService.confirm({
      nzTitle:
        this.translateService.instant('module.file.modalDeleteFile') +
        `${files.name}` +
        ' ?',
      nzOnOk: () => {
        new Promise((resolve, reject) => {
          const fileId = Number(files.id);
          return this.fileService
            .removeFilesFromPlaylist(this.playlistId as number, [fileId])
            .subscribe({
              next: (response) => {
                if (response && response.status === ResponseStatus.Success) {
                  this.getFileByPlaylistIdAndPaging(
                    this.playlistId as number,
                    this.files?.length === 1 && this.pageIndex > 1
                      ? this.pageIndex - 2
                      : this.pageIndex - 1,
                    this.pageSize,
                    'createDate'
                  );
                }
              },
              error: (err) => {
                this.message.error('Error', err);
                this.isLoading = false;
              },
              complete: () => {
                this.isLoading = false;
              },
            });
        }).catch((err) => {
          console.log(err);
          this.isLoading = false;
        });
      },
    });
  }

  getMimeTypeName(fileType: string | any) {
    if (fileType.startsWith('video')) {
      return 'Video';
    } else if (fileType.startsWith('image')) {
      return 'Image';
    } else {
      return 'Other';
    }
  }
}
