import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChosenDeviceComponent } from '@app-admin/app/modules/device-group/components/device-group/chosen-device/chosen-device.component';
import { DeviceGroupAddComponent } from '@app-admin/app/modules/device-group/components/device-group/device-group-add/device-group-add.component';
import { DeviceGroupsComponent } from '@app-admin/app/modules/device-group/components/device-groups/device-groups.component';
import { DeviceListTableComponent } from '@app-admin/app/modules/device-group/components/device-list-table/device-list-table.component';
import { DeviceGroupRoutingModule } from '@app-admin/app/modules/device-group/device-group-routing.module';
import { DeviceModule } from '@app-admin/app/modules/device/device.module';
import { AdminDeviceGroupModule } from '@app-api/lib/modules/admin/group-device/admin-group-device.module';
import { LhDialogModule } from '@app-common/lib/components/lh-dialog/lh-dialog.module';
import { LhTableModule } from '@app-common/lib/components/lh-table/lh-table.module';
import { UiCommonModule } from '@app-common/lib/modules/ui-common/ui-common.module';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

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
    NzModalModule,
  ],
})
export class DeviceGroupModule {}
