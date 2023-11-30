import { NgModule } from '@angular/core';
import { ScheduleListComponent } from '@app-admin/app/modules/schedule/components/schedule-list/schedule-list.component';
import { ScheduleDetailComponent } from '@app-admin/app/modules/schedule/components/schedule-detail/schedule-detail.component';
import { ScheduleAddComponent } from '@app-admin/app/modules/schedule/components/schedule-add/schedule-add.component';
import { CommonModule } from '@angular/common';
import { UiCommonModule } from '@app-common/lib/modules/ui-common/ui-common.module';
import { TranslateModule } from '@ngx-translate/core';
import { LhDialogModule } from '@app-common/lib/components/lh-dialog/lh-dialog.module';
import { LhTableModule } from '@app-common/lib/components/lh-table/lh-table.module';

import { ScheduleRoutingModule } from './schedule-routing.module';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { DragAndDropModule } from 'angular-draggable-droppable';

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
    DragAndDropModule,
  ],
})
export class ScheduleModule {}
