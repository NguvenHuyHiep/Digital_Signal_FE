import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NzUploadChangeParam, NzUploadXHRArgs} from "ng-zorro-antd/upload/interface";
import {NzMessageService} from "ng-zorro-antd/message";
import {FormControl} from "@angular/forms";
import {Subscription} from "rxjs";
import {HttpEventType, HttpResponse} from "@angular/common/http";
import {
  ViewDataUploadFilesResultListCustomApiObjResponse
} from "../../../api/models/viewDataUploadFilesResultListCustomApiObjResponse";
import {LhResourcesService} from "../../../modules/lh-resources.service";
import {NzUploadFile} from "ng-zorro-antd/upload";

@Component({
  selector: 'lib-lh-upload-file',
  templateUrl: './lh-upload-file.component.html',
  styleUrls: ['./lh-upload-file.component.css']
})
export class LhUploadFileComponent implements OnInit, OnChanges {
  @Input() control?: FormControl<string | null>;
  fileList: NzUploadFile[] = [];

  constructor(private msg: NzMessageService
    , private resourcesService: LhResourcesService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    let pathUrl = changes['control'].currentValue?.value;
    if (pathUrl) {
      this.fileList = [
        {
          status: "done",
          name: this.getLatestPathAsFilename(pathUrl) as string,
          uid: '-1',
          url: pathUrl
        }
      ]
    }
  }


  ngOnInit(): void {
    const pathUrl = this.control?.value;
    if (pathUrl) {
      this.fileList = [
        {
          status: "done",
          name: this.getLatestPathAsFilename(pathUrl) as string,
          uid: '-1',
          url: pathUrl
        }
      ]
    }
  }

  uploadFileAction: (uploadItem: NzUploadXHRArgs) => Subscription = (uploadItem: NzUploadXHRArgs) => {

    return this.resourcesService.fileUpload([uploadItem.file as any])
    .subscribe({
      next: event => {
        console.log('event', event);
        if (event.type < HttpEventType.Response) {

        }
        if (event.type === HttpEventType.Response) {
          uploadItem.file.status = 'done';
          event = event as HttpResponse<ViewDataUploadFilesResultListCustomApiObjResponse>;
          uploadItem.file.url = event.url as string;
          if (event?.body?.result && event?.body?.result.length > 0) {
            this.control?.setValue(event.body.result[0].shortUrl as string);
          }
          this.fileList = [uploadItem.file];

        }
      }, error: err => {
        // uploadItem.file.status = 'error';
        // uploadItem.file.error = err;
        this.msg.error('Network error');
      }
    });
  };

  handleChange({file, fileList}: NzUploadChangeParam): void {
    const status = file.status;
    if (status !== 'uploading') {
      console.log(file, fileList);
    }
    if (status === 'done') {
      this.msg.success(`${file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      this.msg.error(`${file.name} file upload failed.`);
    }
  }

  private getLatestPathAsFilename(url: string): string | null {
    // Split the URL by slashes to get the path segments
    const pathSegments = url.split('/');

    // Filter out any empty segments (e.g., if the URL ends with a slash)
    const nonEmptySegments = pathSegments.filter((segment) => segment.trim() !== '');

    // Check if there are any valid segments left
    if (nonEmptySegments.length === 0) {
      return null; // URL doesn't contain any valid path segments
    }

    // Get the last path segment as the filename
    const latestPathSegment = nonEmptySegments[nonEmptySegments.length - 1];

    // If the last segment is empty, take the one before it as the filename
    if (latestPathSegment.trim() === '') {
      return nonEmptySegments[nonEmptySegments.length - 2];
    }

    return latestPathSegment;
  }

}
