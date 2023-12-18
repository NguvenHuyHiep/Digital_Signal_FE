import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { DsdFile } from '@app-api/lib/api/models/dsdFile';
import { ResponseStatus } from '@app-api/lib/api/models/responseStatus';
import { Schedule } from '@app-api/lib/api/models/schedule';
import { AdminFileService } from '@app-api/lib/modules/admin/admin-file/admin-file.service';
import { LhTableComponent } from '@app-common/lib/components/lh-table/lh-table.component';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { saveAs } from 'file-saver';
import { DeviceLog } from '@app-api/lib/api/models/deviceLog';
import { ColumnItem } from '@app-api/lib/api/models/columnItem';

@Component({
  selector: 'app-admin-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
})
export class FilesComponent implements OnInit {
  table?: LhTableComponent<DsdFile>;
  currentFile?: DsdFile;
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

  tableColumns: ColumnItem<DsdFile>[] = [
    {
      name: 'ID',
      sortOrder: 'descend',
      sortFn: (a: DsdFile, b: DsdFile) => (a.id as number) - (b.id as number),
      listOfFilter: [],
      filterFn: null,
      filterMultiple: false,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'module.file.name',
      sortOrder: null,
      sortFn: (a: DsdFile, b: DsdFile) =>
        a.path?.localeCompare(b.path as string) as number,
      listOfFilter: [],
      filterFn: (address: string, item: DsdFile) =>
        item?.status?.indexOf(address) !== -1,
      filterMultiple: false,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'module.file.contentType',
      sortOrder: null,
      sortFn: (a: DsdFile, b: DsdFile) =>
        a.fileType?.localeCompare(b.fileType as string) as number,
      listOfFilter: [],
      filterFn: (address: string, item: DsdFile) =>
        item?.status?.indexOf(address) !== -1,
      filterMultiple: false,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'module.device.update-date',
      sortOrder: null,
      sortFn: (a: DsdFile, b: DsdFile) =>
        Date.parse(a.createDate as string) - Date.parse(b.createDate as string),
      listOfFilter: [],
      filterFn: null,
      filterMultiple: false,
      sortDirections: ['ascend', 'descend', null],
    },
  ];

  previewFile: {
    isVisible: boolean;
    dsdFile?: DsdFile;
    src?: any;
    blob?: Blob;
  } = {
    isVisible: false,
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private translateService: TranslateService,
    private adminFileService: AdminFileService,
    private message: NzMessageService,
    private modalService: NzModalService
  ) {}

  ngOnInit(): void {
    this.getAllFile();
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
                if (response && response?.status === ResponseStatus.Success) {
                  this.files = this.files.filter((f) => f.path !== file.path);
                } else {
                  this.message.error(
                    this.translateService.instant('module.file.error.delete')
                  );
                }
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

  preview(record: DsdFile) {
    console.log('preview: ', record);

    if (record && record.path === this.previewFile.dsdFile?.path) {
      this.previewFile.isVisible = true;
      return;
    }

    this.previewFile = {
      isVisible: true,
    };
    this.previewFile.dsdFile = record;
    if (record && record.id && record.path) {
      this.adminFileService.download(record).subscribe({
        next: (response) => {
          if (response) {
            this.previewFile.src = this.sanitizer.bypassSecurityTrustUrl(
              URL.createObjectURL(response)
            );
            this.previewFile.blob = response;
          } else {
            this.message.error(
              this.translateService.instant('error.cannot-preview-file')
            );
          }
        },
        error: (err) => {
          console.log(err);

          this.message.error(
            this.translateService.instant('error.cannot-preview-file')
          );
        },
        complete: () => {},
      });
    } else {
      this.message.error(
        this.translateService.instant('error.cannot-preview-file')
      );
    }
  }

  isFile(fileType: string | any) {
    return fileType && fileType.startsWith('image/');
  }

  getAllFile(): void {
    this.loading.searching = true;
    this.adminFileService.getAllFile(0, 1000).subscribe({
      next: (response) => {
        if (response && response.status === ResponseStatus.Success) {
          this.files = response.data as DsdFile[];
        } else {
          this.message.error(
            this.translateService.instant('module.file.error.get')
          );
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

  onCancel() {
    console.log('closing');
    this.previewFile.isVisible = false;
  }

  onDownload() {
    console.log('downloading');
    if (
      this.previewFile &&
      this.previewFile.src &&
      this.previewFile.dsdFile?.path
    ) {
      saveAs(this.previewFile.dsdFile.path);
    } else {
      this.message.info(
        this.translateService.instant('error.cannot-download-file')
      );
    }
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
