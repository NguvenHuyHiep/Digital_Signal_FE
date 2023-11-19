import {
  Component,
  EventEmitter,
  forwardRef,
  OnInit,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Device } from '../../../../../../../../app-api/src/lib/api/models/device';

import { AdminDeviceService } from '../../../../../../../../app-api/src/lib/modules/admin/admin-device/admin-device.service';
import { DeviceGroup } from '../../../../../../../../app-api/src/lib/api/models/deviceGroup';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-admin-chosen-device',
  templateUrl: './chosen-device.component.html',
  styleUrls: ['./chosen-device.component.scss'],
  providers: [
    AdminDeviceService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChosenDeviceComponent),
      multi: true,
    },
  ],
})
export class ChosenDeviceComponent implements ControlValueAccessor, OnInit {
  @Output() onDataChange: EventEmitter<Device> = new EventEmitter<Device>();
  devices?: Array<Device> = [];
  loading: {
    adding: boolean;
    searching: boolean;
  } = {
    adding: false,
    searching: false,
  };
  deviceId?: number;
  constructor(
    private adminDeviceService: AdminDeviceService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.getAllDevice();
  }

  // ControlValueAccessor methods
  writeValue(value: number) {
    this.deviceId = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Implement this if you want to support disabling the control
  }

  // Custom methods
  onChange(value: number) {
    // This will be called when the value of the input changes
  }

  onTouched() {
    // This will be called when the input is touched (e.g., when it loses focus)
  }

  getAllDevice() {
    // TODO use search instead of get all records with 10 items, or apply infinitive scroll for this func
    this.adminDeviceService.getAllDevice(0, 10).subscribe({
      next: (response) => {
        if (response.data) {
          this.devices = response.data;
          console.log(this.devices + 'DeviceGroup');
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

  onChangeData(id: number) {
    let device = this.devices?.find((e) => e.id === id);
    this.onDataChange.emit(device);
    this.onChange(id);
  }
}
