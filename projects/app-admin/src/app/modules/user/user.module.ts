import { NgModule } from '@angular/core';
import { UsersComponent } from '@app-admin/app/modules/user/components/users/users.component';
import { UserAddComponent } from '@app-admin/app/modules/user/components/user-add/user-add.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { UserRoutingModule } from '@app-admin/app/modules/user/user-routing.module';
import { LhTableModule } from '@app-common/lib/components/lh-table/lh-table.module';
import { UiCommonModule } from '@app-common/lib/modules/ui-common/ui-common.module';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { LhDialogModule } from '@app-common/lib/components/lh-dialog/lh-dialog.module';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { AdminUserModule } from '@app-api/lib/modules/admin/admin-user/admin-user.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { AdminLicenseModule } from '@app-api/lib/modules/admin/admin-license/admin-license.module';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { UserInformationComponent } from './components/user-information/user-information.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzTableModule } from 'ng-zorro-antd/table';

@NgModule({
  declarations: [UsersComponent, UserAddComponent, UserInformationComponent],
  imports: [
    CommonModule,
    TranslateModule,
    UserRoutingModule,
    LhTableModule,
    UiCommonModule,
    NzSpaceModule,
    NzButtonModule,
    LhDialogModule,
    NzTabsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    AdminUserModule,
    NzLayoutModule,
    FormsModule,
    NzSelectModule,
    AdminLicenseModule,
    NzModalModule,
    NzCardModule,
    NzDescriptionsModule,
    NzCheckboxModule,
    NzTableModule,
  ],
  providers: [],
})
export class UserModule {}
