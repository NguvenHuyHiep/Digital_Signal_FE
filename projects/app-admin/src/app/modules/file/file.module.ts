import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { TranslateModule } from '@ngx-translate/core';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { LhDialogModule } from '@app-common/lib/components/lh-dialog/lh-dialog.module';
import { LhTableModule } from '@app-common/lib/components/lh-table/lh-table.module';
import { UiCommonModule } from '@app-common/lib/modules/ui-common/ui-common.module';
import { FilesComponent } from '@app-admin/app/modules/file/components/files/files.component';
import { FileAddComponent } from '@app-admin/app/modules/file/components/file-add/file-add.component';
import { UploadFileComponent } from '@app-admin/app/modules/file/components/upload-file/upload-file.component';
import { FilesByPlaylist } from '@app-admin/app/modules/file/components/files-by-playlist/files-by-playlist.component';
import { FileRoutingModule } from '@app-admin/app/modules/file/file-routing.module';

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
  ],
})
export class FileModule {}
