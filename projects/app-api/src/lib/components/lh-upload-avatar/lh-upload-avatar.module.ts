import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LhUploadAvatarComponent } from './lh-upload-avatar.component';
import {NzUploadModule} from "ng-zorro-antd/upload";
import {NzIconModule} from "ng-zorro-antd/icon";
import { LhUploadFileComponent } from './lh-upload-file/lh-upload-file.component';
import {TranslateModule} from "@ngx-translate/core";
import {LhUploadImageComponent} from "./lh-upload-image/lh-upload-image.component";

@NgModule({
  declarations: [
    LhUploadAvatarComponent,
    LhUploadFileComponent,
    LhUploadImageComponent
  ],
  imports: [
    CommonModule,
    NzUploadModule,
    NzIconModule,
    TranslateModule
  ],
  exports: [
    LhUploadAvatarComponent
    , LhUploadFileComponent
    , LhUploadImageComponent
  ]
})
export class LhUploadAvatarModule { }
