import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '@app-admin/app/modules/dashboard/pages/dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { AuthenGuardService } from '@app-api/lib/modules/authen/authen-guard.service';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthenGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
