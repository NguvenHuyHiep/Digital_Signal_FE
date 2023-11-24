import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { LhTableComponent } from 'projects/app-common/src/lib/components/lh-table/lh-table.component';
import { Schedule } from '@app-api/lib/api/models/schedule';
import {
  LhTableConfigModel,
  LhTableFieldType,
} from '@app-common/lib/components/lh-table/lh-table-config.model';
import { AdminScheduleService } from '@app-api/lib/modules/admin/admin-schedule/admin-schedule.service';

@Component({
  selector: 'app-admin-schedule-list',
  templateUrl: './schedule-list.component.html',
  styleUrls: ['./schedule-list.component.scss'],
})
export class ScheduleListComponent implements OnInit {
  @ViewChild('table') table?: LhTableComponent<Schedule>;
  loading: {
    search: boolean;
  } = {
    search: false,
  };

  tableConfig: LhTableConfigModel = {
    disableUpdate: true,
    disableDelete: true,
    key: 'id',
    fields: [
      {
        label: 'module.schedule.name',
        field: 'name',
        type: LhTableFieldType.STRING,
      },
      {
        label: 'module.schedule.description',
        field: 'description',
        type: LhTableFieldType.STRING,
      },
    ],
  };
  schedules: Schedule[] = [];

  constructor(
    private activedRoute: ActivatedRoute,
    private router: Router,
    private adminScheduleService: AdminScheduleService,
    private msgService: NzMessageService
  ) {}

  ngOnInit(): void {
    this.getAll();
  }

  getAll = () => {
    this.loading.search = true;
    this.adminScheduleService.getAll(0, 100, 'id', 'desc').subscribe({
      next: (response) => {
        if (response && response.data) {
          this.schedules = response.data;
        }
      },
      error: (err) => {
        console.log(err);
        this.msgService.error('ERROR', err);
      },
      complete: () => {
        this.loading.search = false;
      },
    });
  };

  navigateToCreate = (): void => {
    this.router.navigate(['./create'], {
      relativeTo: this.activedRoute,
    });
  };

  navigateToDetail = (record: Schedule): void => {
    console.log(record);
    this.router.navigate(['./detail', record.id], {
      relativeTo: this.activedRoute,
    });
  };
}
