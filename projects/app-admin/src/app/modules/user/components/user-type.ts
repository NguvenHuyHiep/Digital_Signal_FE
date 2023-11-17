import { FormControl, FormGroup } from '@angular/forms';
import { License } from '../../../../../../app-api/src/lib/api/models/license';

export type FormGroupUser = FormGroup<{
  id?: FormControl<number>;
  phone?: FormControl<string>;
  email?: FormControl<string>;
  userName?: FormControl<string>;
  password?: FormControl<string>;
  firstName?: FormControl<string>;
  lastName?: FormControl<string>;
  // license?: FormControl<License>
}>;
