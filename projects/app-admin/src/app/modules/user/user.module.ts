import { NgModule } from '@angular/core';
import { UsersComponent } from './components/users/users.component';
import { UserAddComponent } from './components/user-add/user-add.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LhTableModule } from '../../../../../app-common/src/lib/components/lh-table/lh-table.module';
import { UiCommonModule } from '../../../../../app-common/src/lib/modules/ui-common/ui-common.module';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { LhDialogModule } from '../../../../../app-common/src/lib/components/lh-dialog/lh-dialog.module';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { AdminUserModule } from '../../../../../app-api/src/lib/modules/admin/admin-user/admin-user.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { UserRoutingModule } from './user-routing.module';
import { AdminLicenseModule } from '../../../../../app-api/src/lib/modules/admin/admin-license/admin-license.module';
import { NzModalModule } from 'ng-zorro-antd/modal';

@NgModule({
  declarations: [UsersComponent, UserAddComponent],
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
  ],
  providers: [],
})
export class UserModule {}
