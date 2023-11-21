import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { Subject } from 'rxjs';
import { Color, DsdCalendarEvent } from '../../admin-schedule.model';

@Component({
  selector: 'app-admin-schedule-detail',
  templateUrl: './schedule-detail.component.html',
  styleUrls: ['./schedule-detail.component.scss'],
})
export class ScheduleDetailComponent implements OnInit {
  scheduleId: number = 0;

  view: CalendarView = CalendarView.Week;

  viewDate = new Date();

  events: DsdCalendarEvent[] = [
    {
      title: 'Draggable event',
      color: Color.yellow,
      start: new Date(),
      draggable: true,
      playlist: {
        id: 1,
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

  refresh = new Subject<void>();

  constructor(private activatedRoute: ActivatedRoute) {
    this.scheduleId = this.activatedRoute.snapshot.params['scheduleId'];
  }

  ngOnInit(): void {}

  getDetail(): void {}

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
