import {FormControl, FormGroup} from "@angular/forms";

export type FormGroupDevice = FormGroup<{
  id?: FormControl<string | null>,
  name?: FormControl<string | null>,
  description?: FormControl<string | null>,
  location?: FormControl<string | null>
}>
