import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

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

@Component({
  selector: 'app-admin-playlist-add',
  templateUrl: './playlist-add.component.html',
  styleUrls: ['./playlist-add.component.scss'],
})
export class PlaylistAddComponent implements OnInit, OnChanges {
  @Input('fileIds') fileIds?: number;
  @Input() playlistAdmin?: Playlist;
  @ViewChild('fileAddComponent', { static: false })
  fileAddComponent?: PlaylistAddComponent;
  files: Array<DsdFile> = [];

  currentFile?: DsdFile;
  form: FormGroupPlayList = this.adminPlaylistService.buildPlaylistForm(
    this.playlistAdmin
  );
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
    key: 'id',
    fields: [
      {
        label: 'module.file.name',
        field: 'name',
        type: LhTableFieldType.STRING,
      },
    ],
  };
  addFileForm: FormGroupFile = this.formBuilder.group({
    fileIds: ['', Validators.required],
  }) as unknown as FormGroupFile;

  constructor(
    private formBuilder: FormBuilder,
    private adminPlaylistService: AdminPlaylistService,
    private message: NzMessageService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit(): void {
    if (this.playlistAdmin) {
      this.patchValue(this.playlistAdmin);
    }
    this.form.valueChanges.subscribe((value) => console.log('value', value));
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
      files: this.form.controls.files?.value as Array<DsdFile>,
    };
    return this.adminPlaylistService.updatePlayList(addObj);
  }

  fileForm(baseForm: FormGroupPlayList): FormArray<FormGroupPlayList> {
    if (!baseForm.controls.files) {
      baseForm.controls.files = new FormArray<FormGroupFile>([]);
    }
    return baseForm.controls.files as FormArray<FormGroupFile>;
  }

  getFormGroupFile(playListForm: FormGroup): FormGroupPlayList {
    return playListForm as FormGroupPlayList;
  }

  detailDevice(record: DsdFile) {
    this.currentFile = record;
    this.showFrame = {
      detail: true,
    };
  }

  setCurrentFile($event: DsdFile) {
    this.currentFile = $event;
  }

  addFile() {
    if (!this.addFileForm) {
      return;
    }
    if (this.playlistAdmin) {
      const FileIdValue = Number(this.addFileForm.controls.fileIds?.value);
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
  }

  private patchValue(obj: Playlist) {
    this.form.patchValue(obj as any);
  }

  private loadFile() {
    this.loading.addFile = true;
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
            this.loading.searching = false;
          },
          complete: () => {
            this.loading.searching = false;
          },
        });
    }
  }
}
