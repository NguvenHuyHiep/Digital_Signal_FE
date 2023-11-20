import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
}
