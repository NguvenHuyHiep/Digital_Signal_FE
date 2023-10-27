import {Component, forwardRef, OnInit} from '@angular/core';
import {NzMessageService} from "ng-zorro-antd/message";
import {NzUploadFile} from "ng-zorro-antd/upload";
import {Observable, Observer, Subscription} from "rxjs";
import {LhResourcesService} from "../../../modules/lh-resources.service";
import {HttpEventType, HttpResponse} from "@angular/common/http";
import {
  ViewDataUploadFilesResultListCustomApiObjResponse
} from "../../../api/models/viewDataUploadFilesResultListCustomApiObjResponse";
import {NzUploadXHRArgs} from "ng-zorro-antd/upload/interface";

import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'lh-upload-image',
  templateUrl: './lh-upload-image.component.html',
  styleUrls: ['./lh-upload-image.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => LhUploadImageComponent),
    multi: true
  }]
})
export class LhUploadImageComponent implements ControlValueAccessor, OnInit {
  loading = false;
  imageUrl?: string;

  constructor(private msg: NzMessageService
    , private resourcesService: LhResourcesService) {

  }

  ngOnInit(): void {

  }

  // ControlValueAccessor methods
  writeValue(value: string): void {
    this.imageUrl = value;
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
  onChange(value: string) {
    // This will be called when the value of the input changes
  }

  onTouched() {
    // This will be called when the input is touched (e.g., when it loses focus)
  }


  beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng: boolean = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.msg.error('You can only upload JPG file!');
        observer.complete();
        return;
      }
      const isLt2M: boolean = (file.size! / 1024 / 1024) < 2;
      if (!isLt2M) {
        this.msg.error('Image must smaller than 2MB!');
        observer.complete();
        return;
      }
      observer.next(isJpgOrPng && isLt2M);
      observer.complete();
    });

  uploadFileAction: (uploadItem: NzUploadXHRArgs) => Subscription = (uploadItem: NzUploadXHRArgs) => {

    return this.resourcesService.fileUpload([uploadItem.file as any])
    .subscribe({
      next: event => {
        console.log('event', event);
        if (event.type < HttpEventType.Response) {
          this.loading = true;
        }
        if (event.type === HttpEventType.Response) {
          uploadItem.file.status = 'done';
          event = event as HttpResponse<ViewDataUploadFilesResultListCustomApiObjResponse>;
          uploadItem.file.url = event.url as string;
          if (event?.body?.result && event?.body?.result.length > 0) {
            this.imageUrl = event.body.result[0].shortUrl as string;
            this.onChange(this.imageUrl);
          }

        }
      }, error: err => {
        this.msg.error('Network error');
        this.loading = false;
      }
    });
  };

  handleChange(info: { file: NzUploadFile }): void {
    console.log('info', info);
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        // Get this url from response in real world.
        this.imageUrl = info.file.url;
        this.onChange(this.imageUrl as string);
        break;
      case 'error':
        this.msg.error('Network error');
        this.loading = false;
        break;
    }
  }

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }

}
