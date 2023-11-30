import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ScheduleListComponent } from '@app-admin/app/modules/schedule/components/schedule-list/schedule-list.component';
import { ScheduleDetailComponent } from '@app-admin/app/modules/schedule/components/schedule-detail/schedule-detail.component';
import { ScheduleAddComponent } from '@app-admin/app/modules/schedule/components/schedule-add/schedule-add.component';

const routes: Routes = [
  {
    path: '',
    component: ScheduleListComponent,
  },
  {
    path: 'detail/:scheduleId',
    component: ScheduleDetailComponent,
  },
  {
    path: 'create',
    component: ScheduleAddComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduleRoutingModule {}
