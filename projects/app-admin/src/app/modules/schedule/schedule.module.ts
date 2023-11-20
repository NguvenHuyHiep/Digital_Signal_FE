import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleListComponent } from './component/schedule-list/schedule-list.component';
import { UiCommonModule } from 'projects/app-common/src/lib/modules/ui-common/ui-common.module';
import { TranslateModule } from '@ngx-translate/core';
import { ScheduleRoutingModule } from './schedule-routing.module';

@NgModule({
  declarations: [ScheduleListComponent],
  imports: [
    CommonModule,
    UiCommonModule,
    TranslateModule,
    ScheduleRoutingModule,
  ],
})
export class ScheduleModule {}
