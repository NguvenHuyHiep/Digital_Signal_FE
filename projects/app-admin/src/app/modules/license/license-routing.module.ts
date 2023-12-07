import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LicenseComponent } from '@app-admin/app/modules/license/components/license/license.component';
import { AuthenGuardService } from '@app-api/lib/modules/authen/authen-guard.service';

const routes: Routes = [
  {
    path: '',
    component: LicenseComponent,
    canActivate: [AuthenGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class LicenseRoutingModule {}
