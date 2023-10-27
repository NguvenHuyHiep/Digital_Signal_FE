import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LhDialogComponent } from './lh-dialog.component';
import {NzLayoutModule} from "ng-zorro-antd/layout";



@NgModule({
  declarations: [
    LhDialogComponent
  ],
  imports: [
    CommonModule,
    NzLayoutModule
  ],
  exports : [
    LhDialogComponent
  ]
})
export class LhDialogModule { }
