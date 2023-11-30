import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LicenseComponent } from '@app-admin/app/modules/license/components/license/license.component';

const routes: Routes = [
  {
    path: '',
    component: LicenseComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class LicenseRoutingModule {}
