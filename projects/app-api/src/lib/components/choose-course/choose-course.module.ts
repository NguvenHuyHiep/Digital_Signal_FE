import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChooseCourseComponent } from './choose-course.component';
import {FormsModule} from "@angular/forms";
import {NzSelectModule} from "ng-zorro-antd/select";
import {AdminCourseModule} from "../../modules/admin/admin-course/admin-course.module";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzButtonModule} from "ng-zorro-antd/button";
import {RouterLink} from "@angular/router";

@NgModule({
  declarations: [
    ChooseCourseComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NzSelectModule,
    AdminCourseModule,
    NzInputModule,
    NzIconModule,
    NzButtonModule,
    RouterLink
  ],
  exports: [ChooseCourseComponent]
})
export class ChooseCourseModule { }
