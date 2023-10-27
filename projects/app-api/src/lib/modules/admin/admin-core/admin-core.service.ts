import {Injectable} from '@angular/core';
import {CoreEmployeeService} from "../../../api";

@Injectable()
export class AdminCoreService {

  constructor(private coreService: CoreEmployeeService) {
  }
}
