import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DeviceDetailComponent } from '@app-admin/app/modules/device/components/device-detail/device-detail.component';
import { DeviceListComponent } from '@app-admin/app/modules/device/components/device-list/device-list.component';
import { DeviceRoutingModule } from '@app-admin/app/modules/device/device-routing.module';
import { AdminDeviceModule } from '@app-api/lib/modules/admin/admin-device/admin-device.module';
import { LhDialogModule } from '@app-common/lib/components/lh-dialog/lh-dialog.module';
import { LhTableModule } from '@app-common/lib/components/lh-table/lh-table.module';
import { UiCommonModule } from '@app-common/lib/modules/ui-common/ui-common.module';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { DeviceLogChartComponent } from './components/device-log-chart/device-log-chart.component';
import { DeviceLogTableComponent } from './components/device-log-table/device-log-table.component';
import { DeviceTableComponent } from './components/device-table/device-table.component';

@NgModule({
  declarations: [
    DeviceListComponent,
    DeviceDetailComponent,
    DeviceTableComponent,
    DeviceLogTableComponent,
    DeviceLogChartComponent,
  ],
  imports: [
    CommonModule,
    DeviceRoutingModule,
    LhDialogModule,
    LhTableModule,
    NzButtonModule,
    NzSpaceModule,
    NzWaveModule,
    TranslateModule,
    UiCommonModule,
    NzLayoutModule,
    NzGridModule,
    NzCardModule,
    AdminDeviceModule,
    NzSwitchModule,
    FormsModule,
    NzTableModule,
    NzSelectModule,
  ],
  exports: [
    DeviceLogChartComponent,
    DeviceLogTableComponent,
    DeviceTableComponent,
  ],
})
export class DeviceModule {}
