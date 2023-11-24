import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { LhTableModule } from '@app-common/lib/components/lh-table/lh-table.module';
import { UiCommonModule } from '@app-common/lib/modules/ui-common/ui-common.module';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { LhDialogModule } from '@app-common/lib/components/lh-dialog/lh-dialog.module';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { AdminLicenseService } from '@app-api/lib/modules/admin/admin-license/admin-license.service';
import { LicenseComponent } from '@app-admin/app/modules/license/components/license/license.component';
import { LicenseRoutingModule } from '@app-admin/app/modules/license/license-routing.module';

@NgModule({
  declarations: [LicenseComponent],
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
    NzInputModule,
  ],
  providers: [AdminLicenseService],
})
export class LicenseModule {}
