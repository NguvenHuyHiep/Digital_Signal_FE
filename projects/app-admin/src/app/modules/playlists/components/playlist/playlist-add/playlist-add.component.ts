import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { FormGroupFile, FormGroupPlayList } from '../../playlist';
import { AdminPlaylistService } from '../../../../../../../../app-api/src/lib/modules/admin/admin-playlist/admin-playlist.service';
import { Playlist } from '../../../../../../../../app-api/src/lib/api/models/playlist';
import { DsdFile } from '../../../../../../../../app-api/src/lib/api/models/dsdFile';
import { BaseOutputPlaylist } from '../../../../../../../../app-api/src/lib/api/models/baseOutputPlaylist';
import { Observable } from 'rxjs';
import {
  LhTableConfigModel,
  LhTableFieldType,
} from '../../../../../../../../app-common/src/lib/components/lh-table/lh-table-config.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { AdminFileService } from 'projects/app-api/src/lib/modules/admin/admin-file/admin-file.service';
import { TranslateModule } from '@ngx-translate/core';
import { PlaylistStatus } from 'projects/app-api/src/lib/api/models/playlistStatus';

@Component({
  selector: 'app-admin-playlist-add',
  templateUrl: './playlist-add.component.html',
  styleUrls: ['./playlist-add.component.scss'],
})
export class PlaylistAddComponent implements OnInit {
  @Input('fileIds') fileIds?: number;
  @Input() playlistAdmin?: Playlist;

  files: Array<DsdFile> = [];

  currentFile: DsdFile = {};

  isVisible: boolean = false;

  form: FormGroupPlayList = this.adminPlaylistService.buildPlaylistForm(
    this.playlistAdmin
  );

  addFileForm: FormGroupFile = this.formBuilder.group({
    fileId: ['', Validators.required],
  }) as unknown as FormGroupFile;

  tabs = [
    {
      code: 'info',
      name: 'module.user.info',
    },
  ];
  isChecked: boolean = false;

  showFrame: {
    detail: boolean;
  } = {
    detail: false,
  };

  loading: {
    searching: boolean;
    addFile: boolean;
  } = {
    addFile: false,
    searching: false,
  };

  tableConfig: LhTableConfigModel = {
    disableDetail: true,
    disableUpdate: true,
    key: 'id',
    fields: [
      {
        label: 'module.file.name',
        field: 'name',
        type: LhTableFieldType.STRING,
      },
    ],
  };

  constructor(
    private formBuilder: FormBuilder,
    private adminPlaylistService: AdminPlaylistService,
    private fileService: AdminFileService,
    private message: NzMessageService,
    private modalService: NzModalService
  ) {}

  ngOnInit(): void {
    this.loadFile();
    if (this.playlistAdmin) {
      this.patchValue(this.playlistAdmin);
    }
    this.form.valueChanges.subscribe((value) => console.log('value', value));
    this.addFileForm.valueChanges.subscribe((value) =>
      console.log('value', value)
    );
  }

  addOrUpdate(): Observable<BaseOutputPlaylist> {
    if (!this.form.valid) {
      this.form.markAsTouched();
      this.form.markAsDirty();
    }
    if (!this.form.controls.id?.value) {
      let addObj: Playlist = {
        name: this.form.controls.name?.value,
        description: this.form.controls.description?.value,
        startTime:
          this.form.controls.startTime?.value instanceof Date
            ? this.form.controls.startTime?.value?.toISOString()
            : this.form.controls.startTime?.value,
        endTime:
          this.form.controls.endTime?.value instanceof Date
            ? this.form.controls.endTime?.value?.toISOString()
            : this.form.controls.endTime?.value,
        isLoop: this.form.controls.isLoop?.value,
        status: this.form.controls.status?.value || PlaylistStatus.Inactive,
        files: this.form.controls.files?.value as Array<DsdFile>,
      };
      return this.adminPlaylistService.addPlayList(addObj);
    }
    let addObj: Playlist = {
      id: Number(this.form.controls.id?.value),
      name: this.form.controls.name?.value,
      description: this.form.controls.description?.value,
      startTime:
        this.form.controls.startTime?.value instanceof Date
          ? this.form.controls.startTime?.value?.toISOString()
          : this.form.controls.startTime?.value,
      endTime:
        this.form.controls.endTime?.value instanceof Date
          ? this.form.controls.endTime?.value?.toISOString()
          : this.form.controls.endTime?.value,
      isLoop: this.form.controls.isLoop?.value,
      status: this.form.controls.status?.value || PlaylistStatus.Inactive,
      files: this.form.controls.files?.value as Array<DsdFile>,
    };
    return this.adminPlaylistService.updatePlayList(addObj);
  }

  deleteFile(record: DsdFile) {
    console.log(record);
    this.modalService.confirm({
      nzTitle: `Do you want to delete the file: ${record.path} ?`,
      nzOnOk: () => {
        new Promise((resolve, reject) => {
          this.fileService.deleteFile(record.path as string).subscribe({
            next: (response) => {
              console.log(response);
              this.files = this.files.filter((f) => f.path !== record.path);
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

  setCurrentFile($event: DsdFile) {
    this.currentFile = $event;
    console.log('this.currentFile', this.currentFile);
  }

  addFile() {
    if (!this.addFileForm) {
      return;
    }

    const FileIdValue = Number(this.currentFile.id);
    this.loading.addFile = true;
    this.adminPlaylistService
      .assignFile(this.playlistAdmin?.id as number, [FileIdValue])
      .subscribe({
        next: (data) => {
          if (data) {
            this.loadFile();
            return;
          }
        },
        error: (err) => {
          // TODO i18n
          this.message.error('Error', err);
          this.loading.searching = false;
        },
        complete: () => {
          this.loading.addFile = false;
        },
      });
  }

  private patchValue(obj: Playlist) {
    this.form.patchValue(obj as any);
  }

  private loadFile() {
    this.loading.addFile = true;
    console.log('playlistAdmin', this.playlistAdmin);
    if (this.playlistAdmin) {
      this.adminPlaylistService
        .getPlaylistWithFile(this.playlistAdmin?.id as number)
        .subscribe({
          next: (response) => {
            if (response.data) {
              this.files = response.data.files as Array<DsdFile>;
              console.log(this.files + 'files');
            }
          },
          error: (err) => {
            // TODO i18n
            this.message.error('Error', err);
            this.loading.addFile = false;
          },
          complete: () => {
            this.loading.addFile = false;
          },
        });
    }
  }
}
