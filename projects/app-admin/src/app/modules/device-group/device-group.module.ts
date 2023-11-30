import { NgModule } from '@angular/core';
import { DeviceGroupsComponent } from '@app-admin/app/modules/device-group/components/device-groups/device-groups.component';
import { DeviceGroupAddComponent } from '@app-admin/app/modules/device-group/components/device-group/device-group-add/device-group-add.component';
import { ChosenDeviceComponent } from '@app-admin/app/modules/device-group/components/device-group/chosen-device/chosen-device.component';
import { DeviceListTableComponent } from '@app-admin/app/modules/device-group/components/device-list-table/device-list-table.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LhTableModule } from '@app-common/lib/components/lh-table/lh-table.module';
import { UiCommonModule } from '@app-common/lib/modules/ui-common/ui-common.module';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { LhDialogModule } from '@app-common/lib/components/lh-dialog/lh-dialog.module';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { DeviceGroupRoutingModule } from '@app-admin/app/modules/device-group/device-group-routing.module';
import { AdminDeviceGroupModule } from '@app-api/lib/modules/admin/group-device/admin-group-device.module';
import { DeviceModule } from '@app-admin/app/modules/device/device.module';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';

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
