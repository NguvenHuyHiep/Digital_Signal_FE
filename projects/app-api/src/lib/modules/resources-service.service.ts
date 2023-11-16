import { Injectable } from '@angular/core';
import {UploadRequest} from "../api/models/uploadRequest";
import {AdminFileControllerService} from "../api/controller/adminFileController.service";
import {Observable} from "rxjs";
import {BaseOutputDsdFile} from "../api/models/baseOutputDsdFile";

@Injectable({
  providedIn: 'root'
})
export class ResourcesServiceService {

  constructor(private adminFileControllerService:AdminFileControllerService) { }
  public fileUpload(uploadRequest: UploadRequest): Observable<BaseOutputDsdFile> {
    return this.adminFileControllerService.upload(uploadRequest);
  }

}
