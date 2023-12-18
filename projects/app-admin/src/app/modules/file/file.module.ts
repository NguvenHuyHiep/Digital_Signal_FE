import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FileAddComponent } from '@app-admin/app/modules/file/components/file-add/file-add.component';
import { FilesByPlaylist } from '@app-admin/app/modules/file/components/files-by-playlist/files-by-playlist.component';
import { FilesComponent } from '@app-admin/app/modules/file/components/files/files.component';
import { UploadFileComponent } from '@app-admin/app/modules/file/components/upload-file/upload-file.component';
import { FileRoutingModule } from '@app-admin/app/modules/file/file-routing.module';
import { LhDialogModule } from '@app-common/lib/components/lh-dialog/lh-dialog.module';
import { LhTableModule } from '@app-common/lib/components/lh-table/lh-table.module';
import { UiCommonModule } from '@app-common/lib/modules/ui-common/ui-common.module';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzUploadModule } from 'ng-zorro-antd/upload';

@NgModule({
  declarations: [
    FilesComponent,
    FileAddComponent,
    UploadFileComponent,
    FilesByPlaylist,
  ],
  exports: [FilesComponent, FileAddComponent, FilesByPlaylist],
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
    NzGridModule,
    NzCardModule,
    NzLayoutModule,
    NzModalModule,
    NzSpinModule,
    NzTableModule,
    NzDividerModule,
  ],
})
export class FileModule {}
