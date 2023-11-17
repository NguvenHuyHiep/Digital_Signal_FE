import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { LhTableComponent } from '../../../../../../../app-common/src/lib/components/lh-table/lh-table.component';
import { FileAddComponent } from '../file-add/file-add.component';
import {
  LhTableConfigModel,
  LhTableFieldType,
} from '../../../../../../../app-common/src/lib/components/lh-table/lh-table-config.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AdminFileService } from '../../../../../../../app-api/src/lib/modules/admin/admin-file/admin-file.service';
import { DsdFile } from '../../../../../../../app-api/src/lib/api/models/dsdFile';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import {
  AdminPlaylistService
} from "../../../../../../../app-api/src/lib/modules/admin/admin-playlist/admin-playlist.service";
import {Playlist} from "../../../../../../../app-api/src/lib/api/models/playlist";

@Component({
  selector: 'app-admin-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
})
export class FilesComponent<T extends Object> implements OnInit {
  @Input() playListAdmin?: Playlist;
  @Output() onGroup: EventEmitter<T> = new EventEmitter<T>();
  @ViewChild('table') table?: LhTableComponent<DsdFile>;
  @ViewChild('addComponent', { static: false }) addComponent?: FileAddComponent;
  currentFile?: DsdFile;
  fileList: NzUploadFile[] = [];
  files: Array<DsdFile> = [];
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
  isSelectedRow(): boolean {
    return (this.table?.setOfCheckedId?.size || 0) > 0;
  }

  constructor(private adminFileService: AdminFileService,
    private adminPlaylistService: AdminPlaylistService
    , private message: NzMessageService
  ) {
  }

  ngOnInit(): void {
    if(this.playListAdmin){
      this.getFileById()
    }else {
      this.getAllFile();
    }
  }

  update(files: DsdFile) {
    this.currentFile = files as DsdFile;
    this.showFrame.add = true;
    this.showFrame.search = false;
  }
  delete(files: DsdFile) {
    this.adminFileService.deleteFile(files.path as string).subscribe({
      next: (response) => {
        this.getAllFile();
      },
      error: (err) => {
        //TODO execption
      },
      complete: () => {
        this.loading.searching = false;
      },
    });
  }
  openAddFrame() {
    this.currentFile = undefined;
    this.showFrame.search = false;
    this.showFrame.add = true;
  }

  deleteSelected() {

  }

  getFileById(): void{
    if(this.playListAdmin){
    this.adminPlaylistService.getPlaylistWithFile(this.playListAdmin?.id as number).subscribe({
      next: (response) => {
        if (response.data) {
          this.files = response.data.files  as Array<DsdFile>;
        }
      }
      , error: err => {
        //TODO Xử lý exception
      }
      , complete: () => {
        this.loading.searching = false;
      }
    })
  }
  }
  getAllFile(): void {
    this.loading.searching = true;
    this.adminFileService.getAllFile(0, 100).subscribe({
      next: (response) => {
        if (response.data) {
          this.files = response.data as Array<DsdFile>;
          console.log(this.files + 'files');
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
    this.addComponent.uploadFiles().subscribe({
      next: (value) => {
        console.log(value);
      },
      error: (err) => {},
      complete: () => {},
    });
  }

  gotoSearch() {
    this.showFrame.search = true;
    this.showFrame.add = false;
  }
}
