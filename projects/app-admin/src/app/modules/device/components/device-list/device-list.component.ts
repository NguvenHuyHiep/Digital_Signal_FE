import { DeviceTableComponent } from './../device-table/device-table.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Device } from '@app-api/lib/api/models/device';
import { DeviceLog } from '@app-api/lib/api/models/deviceLog';
import { DeviceStatus } from '@app-api/lib/api/models/deviceStatus';
import { AdminDeviceGroupService } from '@app-api/lib/modules/admin/group-device/admin-group-device.service';
import { debounce, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'app-admin-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss'],
  providers: [AdminDeviceGroupService],
})
export class DeviceListComponent implements OnInit {
  statusOptions: { label: string; value: string }[] = [
    { label: 'common.all', value: DeviceStatus.Undefined },
    { label: 'common.online', value: DeviceStatus.Online },
    { label: 'common.offline', value: DeviceStatus.Offline },
  ];
  statusSelect: DeviceStatus = DeviceStatus.Undefined;
  searchKeyword: string = '';
  searchForm: FormGroup;

  device: Device = {};
  deviceLogs: DeviceLog[] = [];
  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
    this.searchForm = new FormGroup({
      keyword: new FormControl(''),
      status: new FormControl(DeviceStatus.Undefined),
    });
  }

  ngOnInit(): void {
    this.searchForm.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((data) => {
        if (data) {
          this.searchKeyword = data.keyword;
          this.statusSelect = data.status;
        }
      });
  }

  navigateToDetail(record: Device): void {
    console.log(record);
    this.router.navigate(['./detail', record.id], {
      relativeTo: this.activatedRoute,
    });
  }

  onClearKeyword() {
    this.searchForm.setValue({
      keyword: '',
      status: this.searchForm.value.status,
    });
  }
}
