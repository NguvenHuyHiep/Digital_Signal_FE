import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeviceGroupsComponent } from './components/device-groups/device-groups.component';
import { DeviceGroupAddComponent } from './components/device-group/device-group-add/device-group-add.component';

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
