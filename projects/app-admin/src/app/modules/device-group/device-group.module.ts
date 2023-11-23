import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceGroupsComponent } from './components/device-groups/device-groups.component';
import { DeviceGroupAddComponent } from './components/device-group/device-group-add/device-group-add.component';
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
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { DeviceGroupRoutingModule } from './device-group-routing.module';
import { AdminDeviceGroupModule } from '../../../../../app-api/src/lib/modules/admin/group-device/admin-group-device.module';
import { ChosenDeviceComponent } from './components/device-group/chosen-device/chosen-device.component';
import { DeviceModule } from '../device/device.module';
import { DeviceListTableComponent } from './components/device-list-table/device-list-table.component';

@NgModule({
  declarations: [
    DeviceGroupsComponent,
    DeviceGroupAddComponent,
    ChosenDeviceComponent,
    DeviceListTableComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    LhTableModule,
    UiCommonModule,
    NzSpaceModule,
    NzButtonModule,
    LhDialogModule,
    NzTabsModule,
    ReactiveFormsModule,
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
    DeviceGroupRoutingModule,
    AdminDeviceGroupModule,
    DeviceModule,
    FormsModule,
  ],
})
export class DeviceGroupModule {}
