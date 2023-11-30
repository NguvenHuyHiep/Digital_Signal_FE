import {
  Component,
  EventEmitter,
  forwardRef,
  OnInit,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateService } from '@ngx-translate/core';
import { DeviceGroup } from '@app-api/lib/api/models/deviceGroup';
import { AdminDeviceGroupService } from '@app-api/lib/modules/admin/group-device/admin-group-device.service';
import { ResponseStatus } from '@app-api/lib/api/models/responseStatus';

@Component({
  selector: 'app-admin-chosen-group-device',
  templateUrl: './chosen-group-device.component.html',
  styleUrls: ['./chosen-group-device.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChosenGroupDeviceComponent),
      multi: true,
    },
  ],
})
export class ChosenGroupDeviceComponent
  implements ControlValueAccessor, OnInit
{
  @Output() onDataDeviceGroupChange: EventEmitter<DeviceGroup> =
    new EventEmitter<DeviceGroup>();
  deviceGroups: DeviceGroup[] = [];
  deviceGroupIds?: number;
  loading: {
    adding: boolean;
    searching: boolean;
    device: boolean;
  } = {
    adding: false,
    searching: false,
    device: false,
  };
  constructor(
    private adminDeviceGroupService: AdminDeviceGroupService,
    private message: NzMessageService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.getAllDeviceGroup();
  }
  onChangeData(id: number) {
    let deviceGroup = this.deviceGroups.find((e) => e.id === id);
    this.onDataDeviceGroupChange.emit(deviceGroup);
    this.onChange(id);
  }
  onTouched() {
    // This will be called when the input is touched (e.g., when it loses focus)
  }

  registerOnChange(fn: any): void {}

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(value: number): void {
    this.deviceGroupIds = value;
  }

  private getAllDeviceGroup() {
    this.adminDeviceGroupService.getAllDeviceGroup(0, 10).subscribe({
      next: (response) => {
        if (response && response.status === ResponseStatus.Success) {
          this.deviceGroups = response.data as DeviceGroup[];
          console.log(this.deviceGroups + 'DeviceGroup');
        } else {
          let errorsInStr: string = response.errors
            ?.map((e) => this.translateService.instant(e))
            .join(',') as string;
          this.message.error(errorsInStr);
          this.deviceGroups = [];
        }
      },
      error: (err) => {
        // TODO i18n
        this.message.error('Error', err);
        this.loading.searching = false;
      },
      complete: () => {
        this.loading.searching = false;
      },
    });
  }
  onChange(value: number) {
    // This will be called when the value of the input changes
  }
}
