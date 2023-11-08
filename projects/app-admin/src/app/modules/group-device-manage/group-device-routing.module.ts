import {RouterModule, Routes} from "@angular/router";
import {GroupDeviceComponent} from "./components/group-device/group-devices/group-device.component";
import {NgModule} from "@angular/core";

const routes: Routes =[{
  path: '',component: GroupDeviceComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports:[RouterModule]
})


export class GroupDeviceRoutingModule {}
