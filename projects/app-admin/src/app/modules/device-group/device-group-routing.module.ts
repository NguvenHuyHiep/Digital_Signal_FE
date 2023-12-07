import { RouterModule, Routes } from '@angular/router';
import { DeviceGroupsComponent } from '@app-admin/app/modules/device-group/components/device-groups/device-groups.component';
import { DeviceGroupAddComponent } from '@app-admin/app/modules/device-group/components/device-group/device-group-add/device-group-add.component';
import { NgModule } from '@angular/core';
import { AuthenGuardService } from '@app-api/lib/modules/authen/authen-guard.service';

const routes: Routes = [
  {
    path: '',
    component: DeviceGroupsComponent,
    canActivate: [AuthenGuardService],
  },
  {
    path: 'create',
    component: DeviceGroupAddComponent,
    canActivate: [AuthenGuardService],
  },
  {
    path: 'update/:deviceGroupId',
    component: DeviceGroupAddComponent,
    canActivate: [AuthenGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeviceGroupRoutingModule {}
