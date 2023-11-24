import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AdminFileService } from '@app-api/lib/modules/admin/admin-file/admin-file.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-admin-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss'],
})
export class UploadFileComponent implements OnInit, OnChanges {
  @Input() control?: FormControl<string | null>;
  fileList: NzUploadFile[] = [];
  constructor(
    private msg: NzMessageService,
    private adminFileService: AdminFileService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    let pathUrl = changes['control'].currentValue?.value;
    if (pathUrl) {
      this.fileList = [
        {
          status: 'done',
          name: this.getLatestPathAsFilename(pathUrl) as string,
          uid: '-1',
          url: pathUrl,
        },
      ];
    }
  }

  ngOnInit(): void {
    const pathUrl = this.control?.value;
    if (pathUrl) {
      this.fileList = [
        {
          status: 'done',
          name: this.getLatestPathAsFilename(pathUrl) as string,
          uid: '-1',
          url: pathUrl,
        },
      ];
    }
  }

  private getLatestPathAsFilename(url: string): string | null {
    // Split the URL by slashes to get the path segments
    const pathSegments = url.split('/');

    // Filter out any empty segments (e.g., if the URL ends with a slash)
    const nonEmptySegments = pathSegments.filter(
      (segment) => segment.trim() !== ''
    );

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
