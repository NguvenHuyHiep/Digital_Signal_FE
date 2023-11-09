import {FormControl, FormGroup} from "@angular/forms";

export type FormGroupLicense = FormGroup<{
  id?: FormControl<number>,
  code?: FormControl<string>,
  token?: FormControl<string>,
  publicKey?: FormControl<string>,
  activationDate?: FormControl<Date>,
  expirationDate?: FormControl<Date>,
  description?: FormControl<string>,

}>
