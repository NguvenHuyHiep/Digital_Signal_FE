import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ScheduleListComponent } from '@app-admin/app/modules/schedule/components/schedule-list/schedule-list.component';
import { ScheduleDetailComponent } from '@app-admin/app/modules/schedule/components/schedule-detail/schedule-detail.component';
import { ScheduleAddComponent } from '@app-admin/app/modules/schedule/components/schedule-add/schedule-add.component';
import { AuthenGuardService } from '@app-api/lib/modules/authen/authen-guard.service';

const routes: Routes = [
  {
    path: '',
    component: ScheduleListComponent,
    canActivate: [AuthenGuardService],
  },
  {
    path: 'detail/:scheduleId',
    component: ScheduleDetailComponent,
    canActivate: [AuthenGuardService],
  },
  {
    path: 'create',
    component: ScheduleAddComponent,
    canActivate: [AuthenGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduleRoutingModule {}
