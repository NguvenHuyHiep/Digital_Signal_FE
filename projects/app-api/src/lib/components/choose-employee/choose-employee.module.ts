import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChooseEmployeeComponent } from './choose-employee.component';
import {NzSelectModule} from "ng-zorro-antd/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AdminUserModule} from "../../modules/admin/admin-user/admin-user.module";
import {TranslateModule} from "@ngx-translate/core";



@NgModule({
  declarations: [
    ChooseEmployeeComponent
  ],
  imports: [
    CommonModule,
    NzSelectModule,
    ReactiveFormsModule,
    FormsModule,
    AdminUserModule,
    TranslateModule
  ],
  exports: [ChooseEmployeeComponent]
})
export class ChooseEmployeeModule { }
