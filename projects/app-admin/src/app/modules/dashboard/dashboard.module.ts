import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {TranslateModule} from "@ngx-translate/core";
import {DashboardRoutingModule} from "./dashboard-routing.module";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzLayoutModule} from "ng-zorro-antd/layout";
import {NzPageHeaderModule} from "ng-zorro-antd/page-header";
import {NzBreadCrumbModule} from "ng-zorro-antd/breadcrumb";
import {UiCommonModule} from "../../../../../app-common/src/lib/modules/ui-common/ui-common.module";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzTabsModule} from "ng-zorro-antd/tabs";
import {NzSkeletonModule} from "ng-zorro-antd/skeleton";
import {NzProgressModule} from "ng-zorro-antd/progress";
import {NzImageModule} from "ng-zorro-antd/experimental/image";


@NgModule({
  declarations: [
    DashboardComponent
  ],
    imports: [
        CommonModule,
        TranslateModule,
        DashboardRoutingModule,
        NzGridModule,
        NzCardModule,
        NzLayoutModule,
        NzPageHeaderModule,
        NzBreadCrumbModule,
        UiCommonModule,
        NzAvatarModule,
        NzIconModule,
        NzTabsModule,
        NzSkeletonModule,
        NzProgressModule,
        NzImageModule,
        TranslateModule
    ]
})
export class DashboardModule {
}
