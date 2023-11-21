import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-admin-schedule-detail',
  templateUrl: './schedule-detail.component.html',
  styleUrls: ['./schedule-detail.component.scss'],
})
export class ScheduleDetailComponent implements OnInit {
  scheduleId: number = 0;

  constructor(private activatedRoute: ActivatedRoute) {
    this.scheduleId = this.activatedRoute.snapshot.params['scheduleId'];
  }

  ngOnInit(): void {}

  getDetail(): void {}

  view: CalendarView = CalendarView.Week;

  viewDate = new Date();

  events: CalendarEvent[] = [
    {
      title: 'Draggable event',
      color: {
        primary: '#e3bc08',
        secondary: '#FDF1BA',
      },
      start: new Date(),
      draggable: true,
    },
    {
      title: 'A non draggable event',
      color: {
        primary: '#1e90ff',
        secondary: '#D1E8FF',
      },
      start: new Date(),
    },
  ];

  refresh = new Subject<void>();

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.refresh.next();
  }
}
