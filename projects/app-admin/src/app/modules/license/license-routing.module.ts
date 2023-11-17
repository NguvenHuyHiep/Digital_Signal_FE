import { RouterModule, Routes } from '@angular/router';
import { LicenseComponent } from './components/license/license.component';
import { NgModule } from '@angular/core';

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
