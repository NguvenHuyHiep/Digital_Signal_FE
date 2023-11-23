import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceRoutingModule } from './device-routing.module';
import { LhDialogModule } from '../../../../../app-common/src/lib/components/lh-dialog/lh-dialog.module';
import { LhTableModule } from '../../../../../app-common/src/lib/components/lh-table/lh-table.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { TranslateModule } from '@ngx-translate/core';
import { UiCommonModule } from '../../../../../app-common/src/lib/modules/ui-common/ui-common.module';
import { AdminDeviceModule } from '../../../../../app-api/src/lib/modules/admin/admin-device/admin-device.module';
import { DeviceListComponent } from './components/device-list/device-list.component';
import { DeviceDetailComponent } from './components/device-detail/device-detail.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { DeviceChartComponent } from './components/device-chart/device-chart.component';

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
