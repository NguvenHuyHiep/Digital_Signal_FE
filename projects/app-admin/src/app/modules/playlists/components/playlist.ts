import {FormArray, FormControl, FormGroup} from "@angular/forms";

export type FormGroupFile = FormGroup<{
  id: FormControl<string | null>;
  name?: FormControl<string | null>;
  fileType?: FormControl<string | null>;
  path?: FormControl<string | null>;
  playlist?: FormGroupPlayList
}>

export type FormGroupPlayList = FormGroup<{
  id?: FormControl<number>,
  name?: FormControl<string >,
  description?: FormControl <string>,
  startTime?: FormControl<Date >,
  endTime?: FormControl<Date>,
  isLoop?: FormControl<boolean>,
  files?:FormArray<FormGroupFile>;
}>

