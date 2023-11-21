import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleListComponent } from './components/schedule-list/schedule-list.component';
import { UiCommonModule } from 'projects/app-common/src/lib/modules/ui-common/ui-common.module';
import { TranslateModule } from '@ngx-translate/core';
import { ScheduleRoutingModule } from './schedule-routing.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { LhDialogModule } from 'projects/app-common/src/lib/components/lh-dialog/lh-dialog.module';
import { LhTableModule } from 'projects/app-common/src/lib/components/lh-table/lh-table.module';
import { ScheduleDetailComponent } from './components/schedule-detail/schedule-detail.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { ScheduleAddComponent } from './components/schedule-add/schedule-add.component';

@NgModule({
  declarations: [
    ScheduleListComponent,
    ScheduleDetailComponent,
    ScheduleAddComponent,
  ],
  imports: [
    CommonModule,
    UiCommonModule,
    TranslateModule,
    ScheduleRoutingModule,
    LhDialogModule,
    LhTableModule,
    NzButtonModule,
    NzLayoutModule,
    NzSpaceModule,
    NzGridModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
})
export class ScheduleModule {}
