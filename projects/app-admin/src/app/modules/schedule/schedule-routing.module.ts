import { RouterModule, Routes } from '@angular/router';
import { ScheduleListComponent } from './component/schedule-list/schedule-list.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: ScheduleListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduleRoutingModule {}
