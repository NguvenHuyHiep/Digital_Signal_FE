import { RouterModule, Routes } from '@angular/router';
import { ScheduleListComponent } from './components/schedule-list/schedule-list.component';
import { NgModule } from '@angular/core';
import { ScheduleDetailComponent } from './components/schedule-detail/schedule-detail.component';

const routes: Routes = [
  {
    path: '',
    component: ScheduleListComponent,
  },
  {
    path: 'detail/:scheduleId',
    component: ScheduleDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduleRoutingModule {}
