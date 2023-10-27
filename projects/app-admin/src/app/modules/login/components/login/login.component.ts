import {Component} from '@angular/core';
import {
  UntypedFormGroup,
} from '@angular/forms';
import {environment} from "../../../../../environments/environment";
@Component({
  selector: 'app-admin-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  validateForm!: UntypedFormGroup;
  init: {
    username: string, password: string
  } = {
    username: environment.INIT_USERNAME
    , password: environment.INIT_PASS
  }
}
