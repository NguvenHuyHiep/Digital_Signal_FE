import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ColumnItem } from '@app-api/lib/api/models/columnItem';
import { Device } from '@app-api/lib/api/models/device';
import { DeviceLog } from '@app-api/lib/api/models/deviceLog';
import { DeviceStatus } from '@app-api/lib/api/models/deviceStatus';
import { AdminDeviceService } from '@app-api/lib/modules/admin/admin-device/admin-device.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Observable, Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-admin-device-table',
  templateUrl: './device-table.component.html',
  styleUrls: ['./device-table.component.scss'],
})
export class DeviceTableComponent implements OnChanges {
  @Input('isShowOption') isShowOption?: boolean = false;
  @Input('deviceGroupId') deviceGroupId?: number;
  @Input('status') status?: DeviceStatus = DeviceStatus.Undefined;
  @Input('keyword') keyword?: string = '';
  @Output('onHandleToDetail') onHandleToDetail: EventEmitter<Device> =
    new EventEmitter<Device>();

  searchChanges$: Observable<string>;
  searchSubject: Subject<string> = new Subject<string>();

  devices: Device[] = [];
  deviceForm: FormGroup;

  isLoading: boolean = false;
  tableRowExpandSet = new Set<number>();
  tableColumns: ColumnItem<Device>[] = [
    {
      name: 'ID',
      key: 'id',
    },
    {
      name: 'module.device.code',
      key: 'code',
    },
    {
      name: 'module.device.name',
      key: 'name',
    },
    {
      name: 'module.device.info',
      key: 'information',
    },
    {
      name: 'module.device.status',
      key: 'status',
    },
  ];
  total: number = 0;
  pageIndex: number = 1;
  pageSize: number = 10;
  sortBy: string = 'id';
  sortDirection: string = 'desc';

  constructor(
    private adminDeviceService: AdminDeviceService,
    private message: NzMessageService
  ) {
    this.deviceForm = this.adminDeviceService.buildDeviceForm();

    this.searchChanges$ = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    );

    this.searchChanges$.subscribe({
      next: (value) => {
        this.onSearchDevice(value);
      },
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    this.getDeviceByPaging(
      this.pageIndex - 1,
      this.pageSize,
      this.sortBy,
      this.sortDirection,
      this.keyword,
      this.status
    );
  }

  getDeviceByPaging(
    pageIndex?: number,
    pageSize?: number,
    sortBy?: string,
    sortDirection?: string,
    keyword?: string,
    status?: DeviceStatus
  ): void {
    this.isLoading = true;

    if (this.deviceGroupId && this.deviceGroupId > 0) {
      this.adminDeviceService
        .getDeviceByDeviceGroupIdAndByPaging(
          this.deviceGroupId,
          pageIndex ?? 0,
          pageSize ?? 10,
          sortBy ?? 'id',
          sortDirection ?? 'desc',
          keyword ?? '',
          status ?? DeviceStatus.Undefined
        )
        .subscribe({
          next: (response) => {
            if (response && response.data) {
              this.devices = response.data;
              this.total = response.total ?? 0;
            }
          },
          error: (err) => {
            this.isLoading = false;
            // TODO i18n
            this.message.error('Error', err);
            this.devices = [];
          },
          complete: () => {
            this.isLoading = false;
          },
        });
    } else {
      this.adminDeviceService
        .getDeviceByPaging(
          pageIndex ?? 0,
          pageSize ?? 10,
          sortBy ?? 'id',
          sortDirection ?? 'desc',
          keyword ?? '',
          status ?? DeviceStatus.Undefined
        )
        .subscribe({
          next: (response) => {
            if (response && response.data) {
              this.devices = response.data;
              this.total = response.total ?? 0;
            }
          },
          error: (err) => {
            this.isLoading = false;
            // TODO i18n
            this.message.error('Error', err);
            this.devices = [];
          },
          complete: () => {
            this.isLoading = false;
          },
        });
    }
  }

  onQueryParamsChange(params: NzTableQueryParams) {
    const { pageIndex, pageSize, sort, filter } = params;
    const { key, value } = sort?.find((s) => s.value) || {};
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.sortBy = key ?? 'id';
    this.sortDirection = value?.replace(/end$/, '') ?? 'desc';
    this.getDeviceByPaging(
      this.pageIndex - 1,
      this.pageSize,
      this.sortBy,
      this.sortDirection,
      this.keyword,
      this.status
    );
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.tableRowExpandSet.add(id);
      this.getAllDeviceLogs(id);
    } else {
      this.tableRowExpandSet.delete(id);
    }
  }

  getAllDeviceLogs(currentDeviceId: number) {
    if (currentDeviceId && !isNaN(currentDeviceId)) {
      this.adminDeviceService.getDeviceByIdWithLogs(currentDeviceId).subscribe({
        next: (response) => {
          if (response && response.data && response.data.deviceLogs) {
            const currentDeviceLogs: DeviceLog[] = response.data.deviceLogs;
            this.devices.map((d) => {
              if (d.id === currentDeviceId) {
                d.deviceLogs = currentDeviceLogs;
              }
              return d;
            });
          }
        },
        error: (err) => {
          this.message.error('Error', err);
        },
        complete: () => {},
      });
    }
  }

  handleToDetail(selectedDevice: Device): void {
    this.onHandleToDetail?.emit(selectedDevice);
  }

  onSearchDevice(searchValue: string): void {
    this.keyword = searchValue;
    this.getDeviceByPaging();
  }
}
