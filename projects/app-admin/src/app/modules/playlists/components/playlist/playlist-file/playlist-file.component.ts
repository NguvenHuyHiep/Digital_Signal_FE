import {Component, Input, OnInit} from '@angular/core';

import {FormBuilder} from "@angular/forms";
import {
  AdminPlaylistService
} from "../../../../../../../../app-api/src/lib/modules/admin/admin-playlist/admin-playlist.service";
import {DsdFile} from "../../../../../../../../app-api/src/lib/api/models/dsdFile";
import {Playlist} from "../../../../../../../../app-api/src/lib/api/models/playlist";
import { LhTableConfigModel, LhTableFieldType } from 'projects/app-common/src/lib/components/lh-table/lh-table-config.model';

@Component({
  selector: 'app-admin-playlist-file',
  templateUrl: './playlist-file.component.html',
  styleUrls: ['./playlist-file.component.scss']
})
export class PlaylistFileComponent implements OnInit {
  @Input() playlist?: Playlist;
  currentFile?: DsdFile;
  files: Array<DsdFile> = [];
  playlists?: Playlist;

  showFrame: {
    addFile: boolean,
  } = {
    addFile: false
  }
  loading: {
    addFile: boolean;
    deleteFile: boolean;
    file: boolean;
  } = {
    addFile: false
    , deleteFile: false
    , file: false
  };

  tableConfig: LhTableConfigModel = {
    key: 'id',
    disableDetail: true,
    disableUpdate: true,
    disableDelete: true,
    fields: [
      {
        label: 'ID',
        field: 'id',
        type: LhTableFieldType.STRING,
      },
      {
        label: 'module.file.name',
        field: 'name',
        type: LhTableFieldType.STRING,
      },
      {
        label: 'module.file.contentType',
        field: 'fileType',
        type: LhTableFieldType.STRING,
      }
    ],
  };

  constructor(private formBuilder: FormBuilder
    , private adminPlaylistService: AdminPlaylistService) {
  }

  ngOnInit(): void {
    this.adminPlaylistService.getPlaylistWithFile(this.playlist?.id as number).subscribe(response => {
      if (response && response.data) {
        this.files = response.data.files || [];
      }
    })
  }

  openAddFile() {
    this.currentFile = undefined;
    this.showFrame.addFile = true;
  }

  setCurrentLesson(file: DsdFile) {
    if (!file) {
      this.currentFile = file;
      return;
    }
    if (this.currentFile?.id === file.id) {
      return;
    }
    this.currentFile = file;
  }

  updateFile(file: DsdFile) {
    this.setCurrentLesson(file);
    this.showFrame.addFile = true;
  }

  deleteLesson(file: DsdFile) {

  }


  cancelAddFile() {
    this.currentFile = undefined;
    this.showFrame.addFile = false;
  }

  addFile() {

  }
}

