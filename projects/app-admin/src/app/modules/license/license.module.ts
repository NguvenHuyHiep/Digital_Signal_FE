import {NgModule} from "@angular/core";
import {LicenseComponent} from "./components/license/license.component";
import {LicenseRoutingModule} from "./license-routing.module";
import {CommonModule} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {NzLayoutModule} from "ng-zorro-antd/layout";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NzSelectModule} from "ng-zorro-antd/select";
import {LhTableModule} from "../../../../../app-common/src/lib/components/lh-table/lh-table.module";
import {UiCommonModule} from "../../../../../app-common/src/lib/modules/ui-common/ui-common.module";
import {NzSpaceModule} from "ng-zorro-antd/space";
import {NzButtonModule} from "ng-zorro-antd/button";
import {LhDialogModule} from "../../../../../app-common/src/lib/components/lh-dialog/lh-dialog.module";
import {NzTabsModule} from "ng-zorro-antd/tabs";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";
import {AdminLicenseService} from "../../../../../app-api/src/lib/modules/admin/admin-license/admin-license.service";

@NgModule({
  declarations: [
    LicenseComponent,
  ],
  imports: [
    LicenseRoutingModule,
    CommonModule,
    TranslateModule,
    NzLayoutModule,
    FormsModule,
    NzSelectModule,
    LhTableModule,
    UiCommonModule,
    NzSpaceModule,
    NzButtonModule,
    LhDialogModule,
    NzTabsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule
  ],
  providers: [
    AdminLicenseService
  ]
})
export class LicenseModule {}
