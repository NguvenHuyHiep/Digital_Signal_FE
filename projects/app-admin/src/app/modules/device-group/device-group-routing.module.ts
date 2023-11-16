import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DeviceGroupsComponent} from "./components/device-groups/device-groups.component";
import {DeviceGroupComponent} from "./device-group/device-group.component";

const routes: Routes = [{
  path: '', component: DeviceGroupsComponent
}, {
  path: ':device', component: DeviceGroupComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceGroupRoutingModule {
}
