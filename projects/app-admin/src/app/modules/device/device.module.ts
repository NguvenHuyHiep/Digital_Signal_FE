import { NgModule } from '@angular/core';
import { DeviceListComponent } from '@app-admin/app/modules/device/components/device-list/device-list.component';
import { DeviceDetailComponent } from '@app-admin/app/modules/device/components/device-detail/device-detail.component';
import { DeviceChartComponent } from '@app-admin/app/modules/device/components/device-chart/device-chart.component';
import { CommonModule } from '@angular/common';
import { DeviceRoutingModule } from '@app-admin/app/modules/device/device-routing.module';
import { LhDialogModule } from '@app-common/lib/components/lh-dialog/lh-dialog.module';
import { LhTableModule } from '@app-common/lib/components/lh-table/lh-table.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { TranslateModule } from '@ngx-translate/core';
import { UiCommonModule } from '@app-common/lib/modules/ui-common/ui-common.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { AdminDeviceModule } from '@app-api/lib/modules/admin/admin-device/admin-device.module';

@NgModule({
  declarations: [
    DeviceListComponent,
    DeviceDetailComponent,
    DeviceChartComponent,
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
  ],
  exports: [DeviceDetailComponent, DeviceListComponent],
})
export class DeviceModule {}
