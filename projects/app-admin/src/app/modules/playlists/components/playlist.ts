import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {FormGroupUser} from "../../user/components/user-type";

export type FormGroupFile = FormGroup<{
  id?: FormControl<number>,
  path?: FormControl<string>;


}>

export type FormGroupUploadRequest= FormGroup<{
  file: FormControl<Blob>
}>

export type FormGroupPlayList = FormGroup<{
  id?: FormControl<number>,
  name?: FormControl<string >,
  description?: FormControl <string>,
  startTime?: FormControl<Date >,
  endTime?: FormControl<Date>,
  isLoop?: FormControl<boolean>,
  files?: FormArray<FormGroupFile>;
}>

