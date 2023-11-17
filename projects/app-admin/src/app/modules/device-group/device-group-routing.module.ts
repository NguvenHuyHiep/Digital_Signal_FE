import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeviceGroupsComponent } from './components/device-groups/device-groups.component';

const routes: Routes = [
  {
    path: '',
    component: DeviceGroupsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeviceGroupRoutingModule {}
