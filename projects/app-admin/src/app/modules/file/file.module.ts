import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileRoutingModule } from './file-routing.module';
import { FilesComponent } from './components/files/files.component';
import {LhDialogModule} from "../../../../../app-common/src/lib/components/lh-dialog/lh-dialog.module";
import {LhTableModule} from "../../../../../app-common/src/lib/components/lh-table/lh-table.module";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzSpaceModule} from "ng-zorro-antd/space";
import {NzWaveModule} from "ng-zorro-antd/core/wave";
import {TranslateModule} from "@ngx-translate/core";
import {UiCommonModule} from "../../../../../app-common/src/lib/modules/ui-common/ui-common.module";
import { FileAddComponent } from './components/file-add/file-add.component';
import {NzUploadModule} from "ng-zorro-antd/upload";
import { FileDetailComponent } from './components/file-detail/file-detail.component';
import {NzFormModule} from "ng-zorro-antd/form";
@NgModule({
  declarations: [
    FilesComponent,
    FileAddComponent,
    FileDetailComponent
  ],
  exports: [
    FilesComponent,
    FileAddComponent,
    FileDetailComponent
  ],
  imports: [
    CommonModule,
    FileRoutingModule,
    LhDialogModule,
    LhTableModule,
    NzButtonModule,
    NzSpaceModule,
    NzWaveModule,
    TranslateModule,
    UiCommonModule,
    NzUploadModule,
    NzFormModule,

  ]
})
export class FileModule { }
