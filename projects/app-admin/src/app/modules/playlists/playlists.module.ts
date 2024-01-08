import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaylistsComponent } from './components/playlist/playlists/playlists.component';
import { TranslateModule } from '@ngx-translate/core';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzButtonModule } from 'ng-zorro-antd/button';
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
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { ChosenFileComponent } from './components/playlist/chosen-file/chosen-file.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { ChosenGroupDeviceComponent } from './components/playlist/chosen-group-device/chosen-group-device.component';
import { LhTableModule } from '@app-common/lib/components/lh-table/lh-table.module';
import { LhDialogModule } from '@app-common/lib/components/lh-dialog/lh-dialog.module';
import { AdminPlaylistModule } from '@app-api/lib/modules/admin/admin-playlist/admin-playlist.module';
import { AdminDeviceGroupModule } from '@app-api/lib/modules/admin/group-device/admin-group-device.module';
import { UiCommonModule } from '@app-common/lib/modules/ui-common/ui-common.module';
import { FileModule } from '../file/file.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { PlaylistGroupDeviceTableComponent } from './components/playlist/playlist-group-device-table/playlist-group-device-table.component';
import { PlaylistFileTableComponent } from './components/playlist/playlist-file-table/playlist-file-table.component';

@NgModule({
  declarations: [
    PlaylistsComponent,
    PlaylistAddComponent,
    ChosenFileComponent,
    ChosenGroupDeviceComponent,
    PlaylistGroupDeviceTableComponent,
    PlaylistFileTableComponent,
  ],
  imports: [
    CommonModule,
    UiCommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    PlaylistRoutingModule,
    LhTableModule,
    LhDialogModule,
    NzSpaceModule,
    NzButtonModule,
    NzTabsModule,
    NzFormModule,
    NzInputModule,
    NzLayoutModule,
    NzCardModule,
    NzSkeletonModule,
    NzMenuModule,
    NzSelectModule,
    NzIconModule,
    NzDatePickerModule,
    NzCheckboxModule,
    NzModalModule,
    NzSwitchModule,
    FileModule,
    AdminPlaylistModule,
    AdminDeviceGroupModule,
    NzTableModule,
    NzDividerModule,
  ],
})
export class PlaylistsModule {}
