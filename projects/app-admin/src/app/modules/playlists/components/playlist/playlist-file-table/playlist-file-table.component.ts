import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { BaseOutputPlaylist } from '@app-api/lib/api/models/baseOutputPlaylist';
import { ColumnItem } from '@app-api/lib/api/models/columnItem';
import { DsdFile } from '@app-api/lib/api/models/dsdFile';
import { ResponseStatus } from '@app-api/lib/api/models/responseStatus';
import { AdminFileService } from '@app-api/lib/modules/admin/admin-file/admin-file.service';
import { AdminPlaylistService } from '@app-api/lib/modules/admin/admin-playlist/admin-playlist.service';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-admin-playlist-file-table',
  templateUrl: './playlist-file-table.component.html',
  styleUrls: ['./playlist-file-table.component.scss'],
})
export class PlaylistFileTableComponent implements OnChanges {
  @Input('isShowOption') isShowOption?: boolean = false;
  @Input('playlistId') playlistId?: number = NaN;
  @Input('files') files?: DsdFile[] = [];

  fileOrder?: number[] = [];

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

  constructor(
    private fileService: AdminFileService,
    private playlistService: AdminPlaylistService,
    private message: NzMessageService,
    private modalService: NzModalService,
    private translateService: TranslateService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (
      this.playlistId &&
      !isNaN(this.playlistId) &&
      (!this.files || this.files.length === 0)
    ) {
      this.getPlaylistWithFiles(this.playlistId);
    }
  }

  trackByFn(index: number, item: any) {
    return item.id; // Assuming each item has a unique "id" property
  }

  getPlaylistWithFiles(playlistId: number) {
    if (playlistId && !isNaN(playlistId)) {
      this.isLoading = true;
      this.playlistService.getPlaylistWithFile(playlistId).subscribe({
        next: (response) => {
          if (response && response.status === ResponseStatus.Success) {
            this.files = response?.data?.files ?? [];
            this.sortFilesByFileOrder(response?.data?.fileOrder ?? []);
          }
        },
        error: (err) => {
          console.log(err);
          this.message.error(
            this.translateService.instant('error.file-by-playlist')
          );
          this.files = [];
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    }
  }

  sortFilesByFileOrder(fileOrderList: number[]) {
    this.fileOrder = [...fileOrderList];
    this.files = [...(this.files ?? [])]?.sort((a, b) => {
      const aIndex = fileOrderList?.indexOf(a.id ?? 0);
      const bIndex = fileOrderList?.indexOf(b.id ?? 0);

      if (aIndex < bIndex) {
        return -1;
      } else if (aIndex > bIndex) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  handleRemoveFromPlaylist(selectedFile: DsdFile) {
    this.removeFileFromPlaylist(selectedFile);
  }

  removeFileFromPlaylist(files: DsdFile) {
    this.modalService.confirm({
      nzTitle:
        this.translateService.instant('module.file.modalDeleteFile') +
        `${files.name}` +
        ' ?',
      nzOnOk: () => {
        this.isLoading = true;
        new Promise((resolve, reject) => {
          const fileId = Number(files.id);
          return this.fileService
            .removeFilesFromPlaylist(this.playlistId as number, [fileId])
            .subscribe({
              next: (response) => {
                if (response && response.status === ResponseStatus.Success) {
                  this.files = this.files?.filter((dg) => dg.id !== fileId);
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

  moveRow(file: DsdFile, isUp: boolean) {
    console.log(
      `isUp: ${isUp}, playlistId: ${this.playlistId}, fileId: ${file.id}`
    );
    this.moveFileByPlaylistIdAndFileId(
      this.playlistId as number,
      file.id as number,
      isUp
    );
  }

  private moveFileByPlaylistIdAndFileId(
    playlistId: number,
    fileId: number,
    isUp: boolean
  ) {
    if (playlistId && playlistId >= 0 && fileId && fileId >= 0) {
      this.isLoading = true;
      this.playlistService
        .moveFileByPlaylistIdAndFileIdAndIsUp(playlistId, fileId, isUp)
        .subscribe({
          next: (response) => {
            if (response && response.status === ResponseStatus.Success) {
              this.sortFilesByFileOrder(response.data?.fileOrder ?? []);
            } else {
              console.log(response.errors);
              this.message.error(
                this.translateService.instant('error.invalid-file-or-playlist')
              );
            }
          },
          error: (err) => {
            console.log(err);
            this.message.error(
              this.translateService.instant('error.invalid-file-or-playlist')
            );
            this.isLoading = false;
          },
          complete: () => {
            this.isLoading = false;
          },
        });
    } else {
      this.message.error(
        this.translateService.instant('error.invalid-file-or-playlist')
      );
    }
  }

  handleRefreshOrder() {
    this.modalService.confirm({
      nzTitle: this.translateService.instant(
        'module.playlist.refresh-file-order-warning'
      ),
      nzOnOk: () => {
        this.isLoading = true;
        new Promise((resolve, reject) => {
          this.isLoading = true;
          return this.playlistService
            .refreshFileOrderByPlaylistId(this.playlistId ?? NaN)
            .subscribe({
              next: (response) => {
                if (response && response.status === ResponseStatus.Success) {
                  this.sortFilesByFileOrder(response.data?.fileOrder ?? []);
                } else {
                  this.message.error(
                    this.translateService.instant(
                      'error.invalid-file-or-playlist'
                    )
                  );
                }
              },
              error: (err) => {
                console.log(err);
                this.message.error(
                  this.translateService.instant(
                    'error.invalid-file-or-playlist'
                  )
                );
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
}
