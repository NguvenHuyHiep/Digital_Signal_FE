import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import {CommonLoginModule} from "../../../../../app-common/src/lib/modules/login/common-login.module";
import {ForgotPasswordComponent} from "./components/forgot-password/forgot-password.component";
import {RegisterComponent} from "./components/register/register.component";
const routes: Routes = [{ path: '', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent }];

@NgModule({
  declarations: [LoginComponent
    , ForgotPasswordComponent, RegisterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzButtonModule,
    NzCheckboxModule,
    NzInputModule,
    NzSelectModule,
    NzGridModule,
    NzToolTipModule,
    TranslateModule,
    CommonLoginModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class LoginModule {}
