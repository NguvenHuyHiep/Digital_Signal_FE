import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { DsdFile } from '@app-api/lib/api/models/dsdFile';
import { ResponseStatus } from '@app-api/lib/api/models/responseStatus';
import { Schedule } from '@app-api/lib/api/models/schedule';
import { AdminFileService } from '@app-api/lib/modules/admin/admin-file/admin-file.service';
import {
  LhTableConfigModel,
  LhTableFieldType,
} from '@app-common/lib/components/lh-table/lh-table-config.model';
import { LhTableComponent } from '@app-common/lib/components/lh-table/lh-table.component';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { saveAs } from 'file-saver';

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

  tableConfig: LhTableConfigModel = {
    disableUpdate: true,
    disableDetail: true,
    enablePreview: true,
    key: 'id',
    fields: [
      {
        label: 'module.file.name',
        field: 'name',
        type: LhTableFieldType.STRING,
      },
    ],
  };

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
    this.adminFileService.getAllFile(0, 100).subscribe({
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
      this.previewFile.blob &&
      this.previewFile.dsdFile?.path
    ) {
      saveAs(this.previewFile.blob, this.previewFile.dsdFile.path);
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
