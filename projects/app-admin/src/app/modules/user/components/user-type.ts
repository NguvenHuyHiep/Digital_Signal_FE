import {FormControl, FormGroup} from "@angular/forms";

export type FormGroupUser = FormGroup<{
  id?: FormControl<number>,
  phone?: FormControl <string>,
  email?: FormControl<string>,
  userName?: FormControl <string>,
  password?: FormControl<string>,
  roles?: FormControl<string>,
  firstName?: FormControl<string>,
  lastName?: FormControl<string>
}>

