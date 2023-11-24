import { RouterModule, Routes } from '@angular/router';
import { DeviceListComponent } from '@app-admin/app/modules/device/components/device-list/device-list.component';
import { DeviceDetailComponent } from '@app-admin/app/modules/device/components/device-detail/device-detail.component';
import { NgModule } from '@angular/core';

let routes: Routes;
routes = [
  {
    path: '',
    component: DeviceListComponent,
  },
  {
    path: 'detail/:deviceId',
    component: DeviceDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeviceRoutingModule {}
