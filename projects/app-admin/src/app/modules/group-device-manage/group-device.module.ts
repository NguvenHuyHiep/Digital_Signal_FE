import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {GroupDeviceRoutingModule} from "./group-device-routing.module";
import {LhTableModule} from "../../../../../app-common/src/lib/components/lh-table/lh-table.module";
import {UiCommonModule} from "../../../../../app-common/src/lib/modules/ui-common/ui-common.module";
import {NzSpaceModule} from "ng-zorro-antd/space";
import {NzButtonModule} from "ng-zorro-antd/button";
import {LhDialogModule} from "../../../../../app-common/src/lib/components/lh-dialog/lh-dialog.module";
import {NzTabsModule} from "ng-zorro-antd/tabs";
import {ReactiveFormsModule} from "@angular/forms";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";
import {GroupDeviceComponent} from "./components/group-device/group-devices/group-device.component";
import {GroupDeviceAddComponent} from "./components/group-device/group-device-add/group-device-add.component";
import { GroupDeviceContentComponent } from './components/group-device/group-device-content/group-device-content.component';
import {NzLayoutModule} from "ng-zorro-antd/layout";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzSkeletonModule} from "ng-zorro-antd/skeleton";
import {NzMenuModule} from "ng-zorro-antd/menu";

import {
  AdminGroupDeviceModule
} from "../../../../../app-api/src/lib/modules/admin/group-device/admin-group-device.module";
import { DeviceAddComponent } from './components/device/device-add/device-add.component';


@NgModule({
  declarations: [
    GroupDeviceComponent,
    GroupDeviceAddComponent,
    GroupDeviceContentComponent,
    DeviceAddComponent,
  ],
    imports: [
        CommonModule,
        TranslateModule,
        GroupDeviceRoutingModule,
        LhTableModule,
        UiCommonModule,
        NzSpaceModule,
        NzButtonModule,
        LhDialogModule,
        NzTabsModule,
        ReactiveFormsModule,
        NzFormModule,
        NzInputModule,
        AdminGroupDeviceModule,
        NzLayoutModule,
        NzCardModule,
        NzIconModule,
        NzSkeletonModule,
        NzMenuModule,
    ],
  providers:[]
})
export class GroupDeviceModule {}
