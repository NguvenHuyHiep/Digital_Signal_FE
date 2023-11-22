import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  CalendarDayViewBeforeRenderEvent,
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarMonthViewBeforeRenderEvent,
  CalendarView,
  CalendarWeekViewBeforeRenderEvent,
} from 'angular-calendar';
import { Subject } from 'rxjs';
import { Color, DsdCalendarEvent } from '../../admin-schedule.model';
import { RRule } from 'rrule';
import { AdminScheduleService } from 'projects/app-api/src/lib/modules/admin/admin-schedule/admin-schedule.service';
import { Schedule } from 'projects/app-api/src/lib/api/models/schedule';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  LhTableConfigModel,
  LhTableFieldType,
} from 'projects/app-common/src/lib/components/lh-table/lh-table-config.model';

@Component({
  selector: 'app-admin-schedule-detail',
  templateUrl: './schedule-detail.component.html',
  styleUrls: ['./schedule-detail.component.scss'],
})
export class ScheduleDetailComponent implements OnInit {
  scheduleId: number = 0;

  refresh = new Subject<void>();
  view: CalendarView = CalendarView.Week;
  viewDate = new Date();
  dsdSchedule: Schedule = {};
  events: DsdCalendarEvent[] = [
    {
      title: 'Draggable event',
      color: Color.yellow,
      start: new Date(),
      draggable: true,
      playlist: {
        id: 1,
      },
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
    },
    {
      title: 'draggable event',
      color: Color.blue,
      start: new Date(),
      draggable: true,
      playlist: {
        id: 2,
      },
    },
  ];

  tableConfig: LhTableConfigModel = {
    disableOption: true,
    disableDelete: true,
    disableDetail: true,
    disableUpdate: true,
    key: 'id',
    fields: [
      {
        label: 'module.playlist.name',
        field: 'name',
        type: LhTableFieldType.STRING,
      },
    ],
  };

  constructor(
    private msg: NzMessageService,
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private adminScheduleService: AdminScheduleService
  ) {
    this.scheduleId = this.activatedRoute.snapshot.params['scheduleId'];
  }

  ngOnInit(): void {
    this.getDetail(this.scheduleId);
  }

  getDetail(id: number): void {
    this.adminScheduleService.getDetailByIdWithPlaylists(id).subscribe({
      next: (response) => {
        if (response && response.data) {
          console.log('response: ', response);
          this.dsdSchedule = response.data;
        }
      },
      error: (err) => {
        console.log('ERROR: ', err);
      },
      complete: () => {},
    });
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.refresh.next();
    console.log('event: ', event);
  }
}
