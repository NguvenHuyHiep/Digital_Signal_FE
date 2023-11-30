import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { PlaylistStatus } from '@app-api/lib/api/models/playlistStatus';

export type FormGroupFile = FormGroup<{
  id?: FormControl<number>;
  path?: FormControl<string>;
  fileId?: FormControl<number>;
}>;

export type FormGroupUploadRequest = FormGroup<{
  file: FormControl<Blob>;
}>;

export type FormGroupPlayList = FormGroup<{
  id?: FormControl<number>;
  name?: FormControl<string>;
  description?: FormControl<string>;
  startTime?: FormControl<Date>;
  endTime?: FormControl<Date>;
  isLoop?: FormControl<boolean>;
  status?: FormControl<PlaylistStatus>;
  files?: FormArray<FormGroupFile>;
}>;
