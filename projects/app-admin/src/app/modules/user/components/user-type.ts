import {FormControl, FormGroup} from "@angular/forms";

export type FormGroupUser = FormGroup<{
  id?: FormControl<string | null>,
  phone?: FormControl <string | null>,
  email?: FormControl<string | null>,
  userName?: FormControl <string | null>,
  password?: FormControl<string | null>,
  roles?: FormControl<string | null>,
  firstName?: FormControl<string | null>,
  lastName?: FormControl<string | null>
}>

