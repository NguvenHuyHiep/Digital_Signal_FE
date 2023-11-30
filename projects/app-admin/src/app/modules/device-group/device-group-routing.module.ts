import { RouterModule, Routes } from '@angular/router';
import { DeviceGroupsComponent } from '@app-admin/app/modules/device-group/components/device-groups/device-groups.component';
import { DeviceGroupAddComponent } from '@app-admin/app/modules/device-group/components/device-group/device-group-add/device-group-add.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: DeviceGroupsComponent,
  },
  {
    path: 'create',
    component: DeviceGroupAddComponent,
  },
  {
    path: 'update/:deviceGroupId',
    component: DeviceGroupAddComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeviceGroupRoutingModule {}
