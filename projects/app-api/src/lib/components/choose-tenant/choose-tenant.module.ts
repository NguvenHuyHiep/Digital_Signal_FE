import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChooseTenantComponent } from './choose-tenant.component';
import {NzSelectModule} from "ng-zorro-antd/select";
import {FormsModule} from "@angular/forms";
import {AdminUserModule} from "../../modules/admin/admin-user/admin-user.module";

@NgModule({
  declarations: [
    ChooseTenantComponent
  ],
  imports: [
    CommonModule
    , NzSelectModule
    , FormsModule
    , AdminUserModule
  ],
  exports: [
    ChooseTenantComponent
  ]
})
export class ChooseTenantModule { }
