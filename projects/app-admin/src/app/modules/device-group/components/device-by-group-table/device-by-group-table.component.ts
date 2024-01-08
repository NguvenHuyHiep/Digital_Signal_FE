import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ColumnItem } from '@app-api/lib/api/models/columnItem';
import { Device } from '@app-api/lib/api/models/device';
import { DeviceLog } from '@app-api/lib/api/models/deviceLog';
import { DeviceStatus } from '@app-api/lib/api/models/deviceStatus';
import { ResponseStatus } from '@app-api/lib/api/models/responseStatus';
import { AdminDeviceService } from '@app-api/lib/modules/admin/admin-device/admin-device.service';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-admin-device-by-group-table',
  templateUrl: './device-by-group-table.component.html',
  styleUrls: ['./device-by-group-table.component.scss'],
})
export class DeviceByGroupTableComponent implements OnChanges {
  @Input('isShowOption') isShowOption?: boolean = false;
  @Input('deviceGroupId') deviceGroupId?: number;
  @Input('status') status?: DeviceStatus = DeviceStatus.Undefined;
  @Output('onHandleToDetail') onHandleToDetail: EventEmitter<Device> =
    new EventEmitter<Device>();

  devices: Device[] = [];

  isLoading: boolean = false;
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
  keyword: string = '';

  constructor(
    private adminDeviceService: AdminDeviceService,
    private modalService: NzModalService,
    private message: NzMessageService,
    private translateService: TranslateService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    this.getDeviceByDeviceGroupIdAndByPaging(
      this.pageIndex - 1,
      this.pageSize,
      this.sortBy,
      this.sortDirection,
      this.keyword,
      this.status
    );
  }

  getDeviceByDeviceGroupIdAndByPaging(
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
    }
  }

  onQueryParamsChange(params: NzTableQueryParams) {
    const { pageIndex, pageSize, sort, filter } = params;
    const { key, value } = sort?.find((s) => s.value) || {};
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.sortBy = key ?? 'id';
    this.sortDirection = value?.replace(/end$/, '') ?? 'desc';
    this.getDeviceByDeviceGroupIdAndByPaging(
      this.pageIndex - 1,
      this.pageSize,
      this.sortBy,
      this.sortDirection,
      this.keyword,
      this.status
    );
  }

  onRemoveDeviceFromDeviceGroup(device: Device) {
    this.modalService.confirm({
      nzTitle:
        this.translateService.instant('module.device.modalRemoveDevice') +
        `${device.name}` +
        ' ?',
      nzOnOk: () => {
        this.isLoading = true;
        new Promise((resolve, reject) => {
          const deviceIds = Number(device.id);
          return this.adminDeviceService
            .removeDevicesFromDeviceGroup(this.deviceGroupId as number, [
              deviceIds,
            ])
            .subscribe({
              next: (response) => {
                if (response && response.status === ResponseStatus.Success) {
                  this.getDeviceByDeviceGroupIdAndByPaging(
                    this.devices?.length === 1 && this.pageIndex > 1
                      ? this.pageIndex - 2
                      : this.pageIndex - 1,
                    this.pageSize
                  );
                } else {
                  console.log(response.errors);
                }
              },
              error: (err) => {
                console.log(err);
                this.isLoading = false;
              },
              complete: () => {
                this.isLoading = false;
              },
            });
        }).catch((err) => {
          console.log(err);
          this.isLoading = false;
        });
      },
    });
  }
}
