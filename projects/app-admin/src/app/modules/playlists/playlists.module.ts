import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaylistComponent } from './components/playlist/playlist/playlist.component';
import { TranslateModule } from '@ngx-translate/core';
import { LhTableModule } from '../../../../../app-common/src/lib/components/lh-table/lh-table.module';
import { UiCommonModule } from '../../../../../app-common/src/lib/modules/ui-common/ui-common.module';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { LhDialogModule } from '../../../../../app-common/src/lib/components/lh-dialog/lh-dialog.module';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { PlaylistAddComponent } from './components/playlist/playlist-add/playlist-add.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { PlaylistRoutingModule } from './playlist-routing.module';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AdminPlaylistModule } from '../../../../../app-api/src/lib/modules/admin/admin-playlist/admin-playlist.module';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { FileModule } from '../file/file.module';

@NgModule({
  declarations: [PlaylistComponent, PlaylistAddComponent],
  imports: [
    CommonModule,
    TranslateModule,
    LhTableModule,
    UiCommonModule,
    NzSpaceModule,
    NzButtonModule,
    PlaylistRoutingModule,
    AdminPlaylistModule,
    LhDialogModule,
    NzTabsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzLayoutModule,
    FormsModule,
    NzCardModule,
    NzSkeletonModule,
    NzMenuModule,
    NzSelectModule,
    NzIconModule,
    NzDatePickerModule,
    NzCheckboxModule,
    FileModule,
  ],
})
export class PlaylistsModule {}
