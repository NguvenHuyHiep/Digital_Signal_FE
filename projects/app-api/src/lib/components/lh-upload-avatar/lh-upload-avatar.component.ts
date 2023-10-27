import {Component, Input, OnInit} from '@angular/core';
import {NzMessageService} from "ng-zorro-antd/message";
import {NzUploadFile} from "ng-zorro-antd/upload";
import {map, Observable, Observer, Subscription} from "rxjs";
import {LhResourcesService} from "../../modules/lh-resources.service";
import {HttpEvent, HttpEventType, HttpProgressEvent, HttpResponse} from "@angular/common/http";
import {
  ViewDataUploadFilesResultListCustomApiObjResponse
} from "../../api/models/viewDataUploadFilesResultListCustomApiObjResponse";
import {NzUploadXHRArgs} from "ng-zorro-antd/upload/interface";
import {
  FormGroupAvatar
} from "../../../../../app-admin/src/app/modules/courses/components/course/course-type";
import {FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'lh-common-lh-upload-avatar',
  templateUrl: './lh-upload-avatar.component.html',
  styleUrls: ['./lh-upload-avatar.component.css']
})
export class LhUploadAvatarComponent implements OnInit {
  loading = false;
  avatarUrl?: string;

  @Input() form!: FormGroupAvatar;
  base: {
    avatarUrl?: string, wallpaper?: string
  } = {};

  constructor(private msg: NzMessageService
    , private resourcesService: LhResourcesService
    , private formBuilder: FormBuilder) {

  }


  ngOnInit(): void {
    if (!this.form.controls.avatarUrl) {
      this.form.addControl('avatarUrl', this.formBuilder.control('', {
        updateOn: 'change'
      }));
    }

    if (!this.form.controls.wallpaper) {
      this.form.addControl('wallpaper', this.formBuilder.control('', {
        updateOn: 'change'
      }));
    }

    if (this.form.controls.avatarUrl?.value) {
      this.base.avatarUrl = this.form.controls.avatarUrl?.value as string;
      this.base.wallpaper = this.form.controls.wallpaper?.value as string;
      this.avatarUrl = this.base.avatarUrl;
    }
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
            this.form.controls.avatarUrl?.setValue(event.body.result[0].thumbnailUrl as string);
            this.form.controls.wallpaper?.setValue(event.body.result[0].shortUrl as string);
            this.avatarUrl = event.body.result[0].shortUrl as string;
          }

        }
      }, error: err => {
        // uploadItem.file.status = 'error';
        // uploadItem.file.error = err;
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
        this.avatarUrl = info.file.url;
        // this.getBase64(info.file!.originFileObj!, (img: string) => {
        //   this.loading = false;
        //   this.avatarUrl = img;
        // });
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
