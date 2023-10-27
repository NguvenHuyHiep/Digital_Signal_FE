import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {NzInputModule} from "ng-zorro-antd/input";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzFormModule} from "ng-zorro-antd/form";
import {TranslateModule} from "@ngx-translate/core";
import {RouterModule, Routes} from "@angular/router";
import {ForgotPasswordComponent} from "./components/forgot-password/forgot-password.component";
import {LoginModule} from "./login.module";
import {
  CommonForgotPasswordComponent
} from "../../../../../app-common/src/lib/modules/login/components/forgot-password/common-forgot-password.component";
import {CommonLoginModule} from "../../../../../app-common/src/lib/modules/login/common-login.module";


const routes: Routes = [
  {path: '', component: ForgotPasswordComponent}
];

@NgModule({
  declarations: [
    ForgotPasswordComponent
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
    LoginModule,
    CommonLoginModule,
    RouterModule.forChild(routes)
  ]
})
export class ForgotPasswordModule {
}
