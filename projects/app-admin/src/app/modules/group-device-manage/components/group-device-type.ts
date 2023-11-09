import {FormControl, FormGroup} from "@angular/forms";

export type FormGroupDevice = FormGroup<{
  id?: FormControl<number>,
  groupName?: FormControl<string>,
  description?: FormControl<string>,
}>
