import {Component, Input} from '@angular/core';
import {FormGroupFile} from "../../playlist";
import {
  AdminPlaylistService
} from "../../../../../../../../app-api/src/lib/modules/admin/admin-playlist/admin-playlist.service";
import {FormBuilder} from "@angular/forms";
import {DsdFile} from "../../../../../../../../app-api/src/lib/api/models/dsdFile";
import {Playlist} from "../../../../../../../../app-api/src/lib/api/models/playlist";

@Component({
  selector: 'app-admin-file-add',
  templateUrl: './file-add.component.html',
  styleUrls: ['./file-add.component.scss']
})
export class FileAddComponent {
  @Input() playlist?: Playlist;
  @Input() file?: DsdFile;
  form: FormGroupFile = this.adminPlaylistService.buildFileForm(this.file, this.playlist);

  constructor(private formBuilder: FormBuilder
    , private adminPlaylistService: AdminPlaylistService) {

  }
}
