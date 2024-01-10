import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ColumnItem } from '@app-api/lib/api/models/columnItem';
import { DeviceGroup } from '@app-api/lib/api/models/deviceGroup';
import { ResponseStatus } from '@app-api/lib/api/models/responseStatus';
import { AdminDeviceGroupService } from '@app-api/lib/modules/admin/group-device/admin-group-device.service';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-admin-playlist-group-device-table',
  templateUrl: './playlist-group-device-table.component.html',
  styleUrls: ['./playlist-group-device-table.component.scss'],
})
export class PlaylistGroupDeviceTableComponent implements OnChanges {
  @Input('isShowOption') isShowOption?: boolean = false;
  @Input('playlistId') playlistId?: number = NaN;

  deviceGroups?: DeviceGroup[] = [];

  isLoading: boolean = false;
  tableDeviceGroupsColumns: ColumnItem<DeviceGroup>[] = [
    {
      name: 'ID',
      key: 'id',
    },
    {
      name: 'module.groupDevice.name',
      key: 'name',
    },
    {
      name: 'module.groupDevice.description',
      key: 'description',
    },
  ];
  total: number = 0;
  pageIndex: number = 1;
  pageSize: number = 10;

  constructor(
    private deviceGroupService: AdminDeviceGroupService,
    private message: NzMessageService,
    private modalService: NzModalService,
    private translateService: TranslateService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {}

  getDeviceGroupByPlaylistIdAndPaging(
    playlistId: number,
    pageIndex?: number,
    pageSize?: number,
    sortBy?: string,
    sortDirection?: string
  ) {
    if (playlistId && !isNaN(playlistId)) {
      this.isLoading = true;
      this.deviceGroupService
        .getDeviceGroupByPlaylistIdAndPaging(
          playlistId,
          pageIndex ?? 0,
          pageSize ?? 10,
          sortBy ?? 'id',
          sortDirection ?? 'desc'
        )
        .subscribe({
          next: (response) => {
            if (response && response.data) {
              this.deviceGroups = response.data;
              this.total = response.total ?? 0;
            }
          },
          error: (err) => {
            this.isLoading = false;
            // TODO i18n
            this.message.error('Error', err);
            this.deviceGroups = [];
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
    this.getDeviceGroupByPlaylistIdAndPaging(
      this.playlistId as number,
      pageIndex - 1,
      pageSize,
      key,
      value?.replace(/end$/, '')
    );
  }

  handleRemoveFromPlaylist(selectedDeviceGroup: DeviceGroup) {
    this.removeDeviceGroupFromPlaylist(selectedDeviceGroup);
  }

  removeDeviceGroupFromPlaylist(deviceGroup: DeviceGroup) {
    this.modalService.confirm({
      nzTitle:
        this.translateService.instant(
          'module.groupDevice.modalRemoveDeviceGroup'
        ) +
        `${deviceGroup.name}` +
        ' ?',
      nzOnOk: () => {
        this.isLoading = true;
        new Promise((resolve, reject) => {
          const deviceGroupId = Number(deviceGroup.id);
          return this.deviceGroupService
            .removeDeviceGroupFromPlaylist(this.playlistId as number, [
              deviceGroupId,
            ])
            .subscribe({
              next: (response) => {
                if (response && response.status === ResponseStatus.Success) {
                  this.getDeviceGroupByPlaylistIdAndPaging(
                    this.playlistId as number,
                    this.deviceGroups?.length === 1 && this.pageIndex > 1
                      ? this.pageIndex - 2
                      : this.pageIndex - 1,
                    this.pageSize
                  );
                }
              },
              error: (err) => {
                this.message.error('Error', err);
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
