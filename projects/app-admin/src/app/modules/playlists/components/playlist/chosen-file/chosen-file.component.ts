import {
  Component,
  EventEmitter,
  forwardRef,
  OnInit,
  Output,
} from '@angular/core';
import { DsdFile } from '../../../../../../../../app-api/src/lib/api/models/dsdFile';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AdminFileService } from '../../../../../../../../app-api/src/lib/modules/admin/admin-file/admin-file.service';

@Component({
  selector: 'app-admin-chosen-file',
  templateUrl: './chosen-file.component.html',
  styleUrls: ['./chosen-file.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChosenFileComponent),
      multi: true,
    },
  ],
})
export class ChosenFileComponent implements ControlValueAccessor, OnInit {
  @Output() onDataFileChange: EventEmitter<DsdFile> =
    new EventEmitter<DsdFile>();
  files?: Array<DsdFile> = [];
  loading: {
    adding: boolean;
    searching: boolean;
  } = {
    adding: false,
    searching: false,
  };
  fileIds?: number;
  onTouched() {
    // This will be called when the input is touched (e.g., when it loses focus)
  }
  constructor(
    private adminFileService: AdminFileService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.getAllFile();
  }

  registerOnChange(fn: any): void {}
  onChange(value: number) {
    // This will be called when the value of the input changes
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(value: number): void {
    this.fileIds = value;
  }

  private getAllFile() {
    this.adminFileService.getAllFile(1, 10).subscribe({
      next: (response) => {
        if (response.data) {
          this.files = response.data;
          console.log(this.files + 'DeviceGroup');
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
    let file = this.files?.find((e) => e.id === id);
    this.onDataFileChange.emit(file);
    this.onChange(id);
  }
}
