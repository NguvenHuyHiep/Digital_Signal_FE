import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { FormGroupPlayList } from '../../playlist';
import { AdminPlaylistService } from '../../../../../../../../app-api/src/lib/modules/admin/admin-playlist/admin-playlist.service';
import { Playlist } from '../../../../../../../../app-api/src/lib/api/models/playlist';
import { DsdFile } from '../../../../../../../../app-api/src/lib/api/models/dsdFile';
import { BaseOutputPlaylist } from '../../../../../../../../app-api/src/lib/api/models/baseOutputPlaylist';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-playlist-add',
  templateUrl: './playlist-add.component.html',
  styleUrls: ['./playlist-add.component.scss'],
})
export class PlaylistAddComponent implements OnInit, OnChanges {
  @Input() playlistAdmin?: Playlist;
  @ViewChild('fileAddComponent', { static: false })
  fileAddComponent?: PlaylistAddComponent;
  form: FormGroupPlayList = this.adminPlaylistService.buildPlaylistForm(
    this.playlistAdmin
  );
  tabs = [
    {
      code: 'info',
      name: 'module.user.info',
    },
    {
      code: 'file',
      name: 'module.playlist.file',
    },
  ];
  isChecked: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private adminPlaylistService: AdminPlaylistService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit(): void {
    if (this.playlistAdmin) {
      this.patchValue(this.playlistAdmin);
    }
    this.form.valueChanges.subscribe((value) => console.log('value', value));
  }

  private patchValue(obj: Playlist) {
    this.form.patchValue(obj as any);
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
}
